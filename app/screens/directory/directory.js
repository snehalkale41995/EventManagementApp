import React from 'react';
import { ScrollView, Platform, Image, NetInfo} from 'react-native';
import { Text, View, Icon, Container, Label } from 'native-base';
import { StyleSheet, FlatList, TouchableOpacity, Keyboard, Alert, AsyncStorage, ActivityIndicator, Linking, Dimensions  } from 'react-native';
import { RkComponent, RkTheme, RkStyleSheet, RkText, RkAvoidKeyboard, RkButton, RkCard, RkChoice, RkTextInput, RkChoiceGroup } from 'react-native-ui-kitten';
import { NavigationActions } from 'react-navigation';
import ReactMoment from 'react-moment';
import { GradientButton } from '../../components/gradientButton';
import { Avatar } from '../../components';
import * as eventService from '../../serviceActions/event';
import {Loader} from '../../components/loader';
import {Footer} from '../../components/footer';
import {EmptyData} from '../../components/emptyData';
import {TabNavigator} from 'react-navigation';
import * as loginService from "../../serviceActions/login";
import * as regResponseService from "../../serviceActions/registrationResponse";
import Attendee from './attendee';
import {  Tab, TabHeading,Tabs } from "native-base";
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import { BackHandler } from 'react-native';

export class Directory extends RkComponent {
  static navigationOptions = {
    title:'Directory'.toUpperCase()
}
    constructor(props) {
        super(props);
        this.state = {
          sessionList: [],
          userId: "",
          eventId: "",
          isLoaded: false,
          
        };
      }
      handleBackPress=()=>{
          this.props.navigation.replace('HomeMenu');
          return true;        
      }
  componentWillMount(){
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

  }
  componentWillUnmount(){
    BackHandler.removeEventListener('hardwareBackPress',this.handleBackPress);
  }
      componentDidMount() {
        let compRef = this;
        loginService.getCurrentUser(userDetails => {
          eventService.getCurrentEvent(eventDetails => {
            this.setState({
              userId: userDetails._id,
              eventId: eventDetails._id
            });
         
          });
        });
      }
    
render() { 
    let {eventId, userId} = this.state;
    return (
      <Tabs style={{ elevation: 3,width:400}} style={styles.tabContent}
        onChangeTab={() => {
         }}
      > 
        <Tab heading='Deligates' tabStyle={{backgroundColor : '#f20505'}} activeTabStyle={{backgroundColor : '#f20505'}} textStyle={{fontSize:11,color:'#ffffff'}} activeTextStyle={{fontSize:11,color:'#fff',fontWeight:'normal'}} 
          >        
          <Attendee navigation={this.props.navigation} profile='Delegate'/> 
        </Tab>
        <Tab heading='Volunteer'  tabStyle={{backgroundColor : '#f20505'}} activeTabStyle={{backgroundColor : '#f20505'}} textStyle={{fontSize:11,color:'#fff'}} activeTextStyle={{fontSize:11,color:'#fff',fontWeight:'normal'}} >
          <Attendee navigation={this.props.navigation} profile='Volunteer'/> 
        </Tab>
        <Tab  heading='Charter Member' tabStyle={{backgroundColor : '#f20505'}} activeTabStyle={{backgroundColor : '#f20505'}} textStyle={{fontSize:11,color:'#fff'}} activeTextStyle={{fontSize:11,color:'#fff',fontWeight:'normal'}} >
          <Attendee  navigation={this.props.navigation}  profile='Charter Member'/> 
        </Tab> 
        <Tab  heading='Eco System Partner' tabStyle={{backgroundColor : '#f20505'}} activeTabStyle={{backgroundColor : '#f20505'}}  textStyle={{fontSize:11,color:'#fff'}} activeTextStyle={{fontSize:11,color:'#fff',fontWeight:'normal'}} >
          <Attendee  navigation={this.props.navigation}  profile='Eco System Partner'/> 
        </Tab> 
        <Tab  heading='Exhibitor'  tabStyle={{backgroundColor : '#f20505'}} activeTabStyle={{backgroundColor : '#f20505'}} textStyle={{fontSize:11,color:'#fff'}} activeTextStyle={{fontSize:11,color:'#fff',fontWeight:'normal'}} >
          <Attendee  navigation={this.props.navigation}  profile='Exhibitor'/> 
        </Tab>
      </Tabs>
    );
  }
}
let styles = RkStyleSheet.create(theme => ({
    screen: {
      backgroundColor: theme.colors.screen.base
    },
    tabContent: {
      backgroundColor: '#FFFFFF',
    },
    textColor : {
      color: '#ed1b24',
      fontSize:11,
      fontWeight:'normal'
    },
    activeBorder:{
      borderColor: '#ed1b24', 
    }
  }));
