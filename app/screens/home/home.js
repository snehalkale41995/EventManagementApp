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
  }
  handleBackPress=()=>{
    if(this.props.navigation.state.routeName=='GridV2' || this.props.navigation.state.routeName=='HomeMenu')
    {
      this.props.navigation.replace('EventsMenu');
      return true;

    }
    else{
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
    return (
      <Container>
       <ProgramsTab navigation={this.props.navigation}/>
      </Container>
    )
  }
}

let styles = RkStyleSheet.create(theme => ({
}));