import React from 'react';
import { RkAvoidKeyboard, RkStyleSheet,RkText } from 'react-native-ui-kitten';
import { Tabs, Tab, Icon, Text, TabHeading } from "native-base";
import { Platform, View ,NetInfo, AsyncStorage, Alert} from 'react-native';
import * as loginService from '../../serviceActions/login';
import { GradientButton } from '../../components/gradientButton';
export class EventDetails extends React.Component {
  static navigationOptions = {
    title: "event details".toUpperCase()
  };

  constructor (props){
    super(props);
    this.state = {
      isOffline : false,
      event : {}
    }
  }

  componentWillMount() {
    if(Platform.OS !== 'ios'){
      NetInfo.isConnected.fetch().then(isConnected => {
        if(isConnected) {
         this.getCurrentEvent();
          this.setState({
            isLoading: true
          });
        } else {
          this.setState({
            isLoading: false,
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
        this.setState({
          isLoading: true
        });
    } else {
      this.setState({
        isLoading: false,
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
          this.setState({event:event})
          }
     })
  }

  _authenticateUser(){
    let event = this.state.event;
      loginService.getCurrentUser((userDetails) => {
       if(event._id === userDetails.event){
       this.props.navigation.navigate('App');
       }
       else{
         Alert.alert("You have not registerd for this event..");
       }
      })
  }

  render() {
    return (
     <View>
         <Text> Hello </Text>
        <GradientButton colors={['#E7060E', '#f55050']} rkType='large' text='JOIN' onPress={() => this._authenticateUser()} />
     </View>
    );
  }
}

let styles = RkStyleSheet.create(theme => ({
  screen: {
    backgroundColor: theme.colors.screen.base
  },
  tabContent: {
    backgroundColor: 'red',
  },
  textColor: {    
    color: '#ed1b24'
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch', 
    backgroundColor : '#E7060E'
  },
  footerOffline : {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch', 
    backgroundColor : '#545454'
  },
  footerText: {
    color : '#f0f0f0',
    fontSize: 11,
  },
  companyName:{
    color : '#ffffff',
    fontSize: 12,
    fontWeight: 'bold'
  },
}));