import React from 'react';
import moment from 'moment';
import { ScrollView, Platform, Image, NetInfo } from 'react-native';
import { Text, View, Icon, Container, Label } from 'native-base';
import { StyleSheet, FlatList, TouchableOpacity, Keyboard, Alert, AsyncStorage, ActivityIndicator } from 'react-native';
import { RkComponent, RkTheme, RkStyleSheet, RkText, RkAvoidKeyboard, RkButton, RkCard, RkChoice, RkTextInput, RkChoiceGroup } from 'react-native-ui-kitten';
import { NavigationActions, StackActions } from 'react-navigation';
import ReactMoment from 'react-moment';
import { GradientButton } from '../../components/gradientButton';
import { Avatar } from '../../components';
import * as eventService from '../../serviceActions/event';
import {Loader} from '../../components/loader';
import {Footer} from '../../components/footer';
import * as loginService from '../../serviceActions/login';

export class MenuEvents extends RkComponent {
    static navigationOptions = {
      title: 'UPCOMING EVENTS'.toUpperCase(),
      headerStyle: {
        backgroundColor: '#ed1b24'
      },
      textAlign:'center',
      headerTintColor: '#fff'
    };

    constructor(props) {
        super(props);
        this.state = {
            Events: [],
            isLoaded: false,
            isOffline: false
        }
    }

  

    componentWillMount() {

        if (Platform.OS !== 'ios') {
            NetInfo.isConnected.fetch().then(isConnected => {
                if (isConnected) {
                    this.getCurrentUser();
                } else {
                    this.setState({
                        isOffline: true
                    });
                }
                this.setState({
                    isOffline: !isConnected
                });
            });
        }
        this.getCurrentUser();
        NetInfo.addEventListener(
            'connectionChange',
            this.handleFirstConnectivityChange
        );
    }

    handleFirstConnectivityChange = (connectionInfo) => {
        if (connectionInfo.type != 'none') {
            this.getCurrentUser();
        } else {
            this.setState({
                isOffline: true
            });
        }
        this.setState({
            isOffline: connectionInfo.type === 'none',
        });
    };

    componentWillUnmount() {
        NetInfo.removeEventListener(
            'connectionChange',
            this.handleFirstConnectivityChange
        );
    }

  getCurrentUser(){
    loginService.getCurrentUser((userDetails) => {
      this.getEventsList(userDetails);
    })
   }

     getEventsList(userDetails) {
        let thisRef = this;
        let Events = [];
        let today = new Date().setHours(0, 0, 0, 0);
        eventService.getEvents().then(function(response) {
         response.forEach( (data)=> {
         let endDate = new Date(data["endDate"]).setHours(0, 0, 0, 0);
         if(today<=endDate){
          Events.push(data);
          }
        });

        if(userDetails.roleName !== "Admin"){
         Events = _.filter(Events, function(event) {
            return event._id === userDetails.event ;
          });
        }

          thisRef.setState({
             Events : Events,
             isLoaded :true
          });
          thisRef.displayEvents();
        }, function(error) {
       //  console.error("Failed!", error);
        })
    }

   storeEventDetails(event){
       let thisRef = this;
     if(event){
         let eventInfo = JSON.stringify(event);
         AsyncStorage.setItem("EVENT_DETAILS", eventInfo);
        thisRef.resetNavigation(thisRef.props.navigation, 'HomeMenu');
     }
      else{
        AsyncStorage.setItem("EVENT_DETAILS", {});
      }
    }

 
    resetNavigation =(navigation, targetRoute) => {
        const resetAction = NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: targetRoute}),
          ],
        });
        this.props.navigation.dispatch(resetAction);
    }

   displayEvents = () => {
   return this.state.Events.map((event, index) => {
            let avatar;
            if (event.eventLogo) {
                avatar = <Image style={{ width: 60, height: 60 }} source={{ uri: event.eventLogo }} />
            } else {
                avatar = <Image style={{ width: 60, height: 60 }} source={require('../../assets/images/defaultSponsorImg.png')} />
            }
            return (
                 <TouchableOpacity key={index} onPress={() => this.storeEventDetails(event)}>
                    <RkCard rkType='shadowed' style={[styles.card]}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flexDirection: 'column', alignItems: 'flex-start', marginVertical: 10, flex: 3, alignSelf: 'center', marginLeft: 10 }}>
                                {avatar}
                            </View>
                        <View style={{ flexDirection: 'column', alignItems: 'flex-start', marginVertical: 10, flex: 6, marginLeft: -10 }}>
                        <View style={{flexDirection : 'row'}}>
                        <Text style={styles.headerText}>{event.eventName}</Text>  
                        </View>
                         <View style={{flexDirection : 'row'}}>
                        <View style={{flexDirection : 'column', alignItems: 'flex-start', marginVertical: 10, flex: 1}}>
                          <Icon style={[styles.iconStyle]}  name='calendar'  />
                        </View>
                         <View style={{flexDirection : 'column', alignItems: 'flex-start', marginVertical: 10, flex: 7}}>
                          <Text style={styles.infoText}> {moment(event.startDate).format(
                                "DD.MM.YYYY"
                              )} - {moment(event.endDate).format("DD.MM.YYYY")} </Text>  
                        </View>
                        </View>
                      <View style={{flexDirection : 'row', marginTop: 0}}>
                       <View style={{flexDirection : 'column', alignItems: 'flex-start', marginVertical: 0, flex: 1}}>
                          <Icon style={[styles.iconStyle]}  name='pin'/>
                        </View>
                         <View style={{flexDirection : 'column', alignItems: 'flex-start', marginVertical: 0, flex: 7}}>
                          <Text style={styles.infoText}>{event.venue}</Text>  
                        </View>
                         </View>
                        </View>
                        </View>
                    </RkCard>
                </TouchableOpacity>
             
            )
        });
    }

    render() {
        let eventList = this.displayEvents();
        if (this.state.isLoaded) {
            return (
                <Container style={[styles.root]}>
                     <ScrollView>
                        <View>
                            {eventList}
                        </View>
                    </ScrollView>
                <View>
                  <Footer isOffline ={this.state.isOffline}/>    
                  </View>
                </Container>
            )
        }
        else {
            return (
               <Container style={[styles.root]}>
                    <Loader/> 
                    <View>
                    <Footer isOffline ={this.state.isOffline}/> 
                    </View>
                </Container>
            )
        }

    }
}

let styles = RkStyleSheet.create(theme => ({
    root: {
        backgroundColor: theme.colors.screen.base
    },
    card: {
        margin: 1,
        padding: 4
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 16
    },
    infoText: {
        fontSize: 12
    },
    iconStyle : {
    color: '#ed1b24',
    fontSize: 15
  },
}));