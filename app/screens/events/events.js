import React from 'react';
import { ScrollView, Platform, Image, NetInfo } from 'react-native';
import { Text, View, Icon, Container, Label } from 'native-base';
import { StyleSheet, FlatList, TouchableOpacity, Keyboard, Alert, AsyncStorage, ActivityIndicator } from 'react-native';
import { RkComponent, RkTheme, RkStyleSheet, RkText, RkAvoidKeyboard, RkButton, RkCard, RkChoice, RkTextInput, RkChoiceGroup } from 'react-native-ui-kitten';
import { NavigationActions } from 'react-navigation';
import ReactMoment from 'react-moment';
import { GradientButton } from '../../components/gradientButton';
import { Service } from '../../services';
import Moment from 'moment';
import firebase from './../../config/firebase';
import { Avatar } from '../../components';
import * as eventService from '../../serviceActions/event';

var firestoreDB = firebase.firestore();
export class Events extends RkComponent {
    static navigationOptions = {
        title: 'Events'.toUpperCase()
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
                    this.getEventsList();
                    this.setState({
                        isLoading: true
                    });
                } else {
                    this.setState({
                        isLoading: false,
                        isOffline: true
                    });
                }
                this.setState({
                    isOffline: !isConnected
                });
            });
        }
        this.getEventsList();
        NetInfo.addEventListener(
            'connectionChange',
            this.handleFirstConnectivityChange
        );
    }

    handleFirstConnectivityChange = (connectionInfo) => {
        if (connectionInfo.type != 'none') {
            this.getEventsList();
            this.setState({
                isLoading: true
            });
        } else {
            this.setState({
                isLoading: false,
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

    getEventsList() {
        let thisRef = this;
        let Events = [];
        eventService.getEvents().then(function(response) {
          Events = response;
          thisRef.setState({
             Events : Events,
             isLoaded :true
          });
          thisRef.displayEvents();
        }, function(error) {
         console.error("Failed!", error);
        })
    }

   storeEventDetails(event){
     if(event){
         let eventInfo = JSON.stringify(event);
         AsyncStorage.setItem("EVENT_DETAILS", eventInfo);
        this.props.navigation.navigate('EventDetails');
     }
      else{
        AsyncStorage.setItem("EVENT_DETAILS", {});
      }
    }

   displayEvents = () => {
   return this.state.Events.map((event, index) => {
            let avatar;
            if (event.eventLogo) {
                avatar = <Image style={{ width: 60, height: 60 }} source={{ uri: event.eventLogo }} />
            } else {
                avatar = <Image style={{ width: 60, height: 60 }} source={require('../../assets/images/defaultSponsorImg.png')} />
            }

            //   <Text style={styles.headerText}>{event.eventName}</Text>
   
            //                     <Text style={styles.infoText}>{event.description}</Text>
            //                 <View>
                                
            //                 </View>

            //                 <Icon style={[styles.textColor]} name="calendar"/>

          
            return (
                 <TouchableOpacity key={index} onPress={() => this.storeEventDetails(event)}>
                    <RkCard rkType='shadowed' style={[styles.card]}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flexDirection: 'column', alignItems: 'flex-start', marginVertical: 10, flex: 3, alignSelf: 'center', marginLeft: 10 }}>
                                {avatar}
                            </View>
                            <View style={{ flexDirection: 'column', alignItems: 'flex-start', marginVertical: 10, flex: 6, marginLeft: -10 }}>
                              
                        <View style={{flexDirection : 'row'}}>
                          <Text style={styles.infoText}>{event.eventName}</Text>  
                        </View>
   
                         <View style={{flexDirection : 'row'}}>
                        <View style={{flexDirection : 'column', alignItems: 'flex-start', marginVertical: 10, flex: 1}}>
                          <Icon name="calendar"/>
                        </View>
                         <View style={{flexDirection : 'column', alignItems: 'flex-start', marginVertical: 10, flex: 2}}>
                          <Text style={styles.infoText}>{event.eventName}</Text>  
                        </View>
                        </View>
                            </View >
                        </View >
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
                    <View style={[styles.footerOffline]}>
                        {
                            this.state.isOffline ? <RkText rkType="small" style={[styles.footerText]}>The Internet connection appears to be offline. </RkText> : null
                        }
                    </View>
                    <View style={[styles.footer]}>
                        <RkText rkType="small" style={[styles.footerText]}>Powered by</RkText>
                        <RkText rkType="small" style={[styles.companyName]}> Eternus Solutions Pvt. Ltd. </RkText>
                    </View> 
                </Container>
            )
        }
        else {
            return (
                <Container style={[styles.root]}>
                     <ScrollView>
                    <View style={[styles.loading]}>
                        <ActivityIndicator size='small' />
                    </View>
                    </ScrollView>
                    <View style={[styles.footerOffline]}>
                        {
                            this.state.isOffline ? <RkText rkType="small" style={[styles.footerText]}>The Internet connection appears to be offline. </RkText> : null
                        }
                    </View>
                    <View style={[styles.footer]}>
                        <RkText rkType="small" style={[styles.footerText]}>Powered by</RkText>
                        <RkText rkType="small" style={[styles.companyName]}> Eternus Solutions Pvt. Ltd. </RkText>
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
    listContainer: {
        flex: 1,
        flexDirection: 'column'
    },
    loading: {
        marginTop: 200,
        left: 0,
        opacity: 0.5,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    card: {
        margin: 1,
        padding: 4,
        height: 75
    },
    header: {
        flexDirection: 'row'
    },
    mainHeader: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginLeft: 5
    },
    roomName: {
        fontSize: 15,
        marginLeft: 5,
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 16
    },
    infoText: {
        fontSize: 12
    },
    content: {
        margin: 2,
        padding: 2
    },
    duration: {
        fontSize: 15,
        marginLeft: 5,
        marginRight: 10
    },
    tileIcons: {
        paddingLeft: 4,
        paddingTop: 4,
        fontSize: 16
    },
    tileFooter: {
        flexDirection: 'row',
        alignContent: 'space-between'
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch',
        backgroundColor: '#E7060E'
    },
    footerOffline: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch',
        backgroundColor: '#545454'
    },
    footerText: {
        color: '#f0f0f0',
        fontSize: 11,
    },
    companyName: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: 'bold'
    },
}));