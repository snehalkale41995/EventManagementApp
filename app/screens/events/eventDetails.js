import React from 'react';
import moment from 'moment';
import { ScrollView, Platform, Image, NetInfo } from 'react-native';
import { Text, View, Icon, Container, Label } from 'native-base';
import { StyleSheet, FlatList, TouchableOpacity, Keyboard, Alert, AsyncStorage, ActivityIndicator } from 'react-native';
import { RkComponent, RkTheme, RkStyleSheet, RkText, RkAvoidKeyboard, RkButton, RkCard, RkChoice, RkTextInput, RkChoiceGroup } from 'react-native-ui-kitten';
import * as loginService from '../../serviceActions/login';
import { GradientButton } from '../../components/gradientButton';
import {Loader} from '../../components/loader';
import {Footer} from '../../components/footer';

export class EventDetails extends React.Component {

  static navigationOptions = ({ navigation, screenProps }) => ({
    title:  'EVENT DETAILS',
    headerLeft: <Icon style={[styles.iconHeader]} name='ios-arrow-back'
    onPress={ () => { navigation.navigate('Event') }} />,
 headerStyle: {
        backgroundColor: '#ed1b24',
      },
      headerTintColor: '#fff'
  });

  constructor (props){
    super(props);
    this.state = {
      isOffline : false,
      event : {},
      isLoaded: false 
    }
  }

  componentWillMount() {
    if(Platform.OS !== 'ios'){
      NetInfo.isConnected.fetch().then(isConnected => {
        if(isConnected) {
         this.getCurrentEvent();
        } else {
          this.setState({
            isOffline : true
          });
        }
        this.setState({
          isOffline: !isConnected
        });
      });  
    }
    this.getCurrentEvent();
    NetInfo.addEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange
    );
  }
  
  handleFirstConnectivityChange = (connectionInfo) => {
    if(connectionInfo.type != 'none') {
         this.getCurrentEvent();
    } else {
      this.setState({
        isOffline : true
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

  getCurrentEvent(){
        AsyncStorage.getItem("EVENT_DETAILS").then((eventDetails)=>{
          if(eventDetails) {
          let event = JSON.parse(eventDetails);
          this.setState({event:event, isLoaded:true})
          }
     })
  }

  _authenticateUser(){
    let event = this.state.event;
      loginService.getCurrentUser((userDetails) => {
      if(userDetails.roleName === "Admin"){
        this.props.navigation.navigate('App');
      }
      else{
      if(event._id === userDetails.event){
       this.props.navigation.navigate('App');
       }
       else{
         Alert.alert("You have not registerd for this Event");
       }
      }
      })
  }

    displayInformation = () => {
    let event = this.state.event;
     let avatar;
            if (event.eventLogo) {
                avatar = <Image style={{ width: 60, height: 60 }} source={{ uri: event.eventLogo }} />
            } else {
                avatar = <Image style={{ width: 60, height: 60 }} source={require('../../assets/images/defaultSponsorImg.png')} />
            }
    return (
      <Container>
        <ScrollView style={styles.root}>
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
                  <View style={{marginLeft :5, alignItems: 'center', marginTop:18}}>
                  <Text style={{marginLeft :5, fontSize : 15, textAlign: 'justify',marginRight :5}}>
                    {event.description}
                  </Text>
                </View>
                 </ScrollView>
               </Container>
           );
        }

  render() {
     let Info = this.displayInformation();
        if (this.state.isLoaded) {
            return (
                <Container style={[styles.root]}>
                    <ScrollView>
                        <View>
                           {Info}
                        </View>
                    </ScrollView>
                   <View style={[styles.joinButton]}>
                 <GradientButton colors={['#f20505', '#f55050']} text='Join Event' style={{width: Platform.OS === 'ios' ? 200 :220 , alignSelf : 'center'}}
                   onPress={() => this._authenticateUser()}/>
                  </View>
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
    joinButton: {
    alignItems: 'center',
    flexDirection: 'column',
    width: Platform.OS === 'ios' ? 320 : 380,
    marginTop: 3,
    marginBottom: 3,
    alignSelf : 'center'
   },
    card: {
        margin: 1,
        padding: 4,
        height : 200
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 18
    },
    infoText: {
        fontSize: 15
    },
    iconStyle : {
    color: '#ed1b24',
    fontSize: 18
  },
  iconHeader : {
    fontSize: 35,
    marginLeft: 15,
    marginRight: 20,
    color : '#fff'
  }
}));