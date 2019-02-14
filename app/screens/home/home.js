import React from 'react';
import { View, ScrollView, TouchableOpacity, Image, Dimensions, Keyboard } from 'react-native';
import { RkButton, RkText, RkChoice, RkModalImg, RkCard, RkTextInput, RkAvoidKeyboard, RkStyleSheet, RkTabView, RkTheme } from 'react-native-ui-kitten';
import { FontAwesome } from '../../assets/icons';
import { GradientButton } from '../../components/gradientButton';
import { scale, scaleModerate, scaleVertical } from '../../utils/scale';
import { NavigationActions } from 'react-navigation';
import { Container, Content, Footer, Header, Title, Button, Icon, Tabs, Tab, Text, Right, Left, Body, TabHeading } from "native-base";
import * as Screens from '../index';
import { ProgramsTab, QueTab} from  '../index';
import { TabNavigator, TabView } from 'react-navigation'
import EventCal from './schedule/EventCal';
import { BackHandler } from 'react-native';

export class HomePage extends React.Component {
  static navigationOptions = ({navigation}) => ({
    title: 'Home'.toUpperCase(),
  });

  constructor(props) {
    super(props);
  
    this.state = { 
      currentTab: 'Home' 
    };
    console.warn("in home constructor")
  }
  handleBackPress=()=>{
    if(this.props.navigation.state.routeName=='GridV2' || this.props.navigation.state.routeName=='HomeMenu')
    {
      //console.log("In ",this.props.navigation.state.routeName)
      //this.props.navigation.popToTop();
      this.props.navigation.replace('EventsMenu');
      return true;

    }
    else{
   // console.log("Out ",this.props.navigation.state.routeName)
    return false;
  }
  }

  componentWillMount(){
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

  }
  componentWillUnmount(){
    BackHandler.removeEventListener('hardwareBackPress',this.handleBackPress);
  }
  render() {
    //console.warn("in home render")
    return (
      <Container>
       <ProgramsTab navigation={this.props.navigation}/>
        {/*
        //Networking is not supported in current release hence commenting below block of code
           <Tabs tabBarPosition="bottom" style={{ elevation: 3 }}>
          <Tab
            heading={
              <TabHeading style={{ flexDirection: 'column' }}><Icon name="calendar"/><Text>Program</Text></TabHeading>
            }
          >
            <ProgramsTab navigation={this.props.navigation}/>
          </Tab>
          <Tab
            heading={
              <TabHeading style={{ flexDirection: 'column' }}><Icon name="ios-link"/><Text>Connect</Text></TabHeading>
            }
          >
          </Tab>
          <Tab
            heading={
              <TabHeading style={{ flexDirection: 'column' }}><Icon name="ios-people"/><Text>Speakers</Text></TabHeading>
            }
          >
          </Tab>
        </Tabs>*/}
      </Container>
    )
  }
}

let styles = RkStyleSheet.create(theme => ({
}));