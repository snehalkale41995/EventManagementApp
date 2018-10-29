import React from 'react';
import {
  DrawerNavigator,
  StackNavigator, SwitchNavigator
} from 'react-navigation';
import {withRkTheme} from 'react-native-ui-kitten';
import {AppRoutes} from './config/navigation/routesBuilder';
import * as Screens from './screens';
import {bootstrap} from './config/bootstrap';
import track from './config/analytics';
import {data} from './data'
import {AppLoading, Font} from 'expo';
import {View, Text, Alert, AsyncStorage, Platform} from "react-native";
import { Permissions, Notifications } from 'expo';
import SocketIOClient from 'socket.io-client';
const socket = SocketIOClient('http://192.168.101.21:3010');

bootstrap();
data.populateData();

function getCurrentRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  if (route.routes) {
    return getCurrentRouteName(route);
  }
  return route.routeName;
}

let SideMenu = withRkTheme(Screens.SideMenu);
const AppStack = DrawerNavigator({
  ...AppRoutes,
},
{
  drawerOpenRoute: 'DrawerOpen',
  drawerCloseRoute: 'DrawerClose',
  drawerToggleRoute: 'DrawerToggle',
  contentComponent: (props) => <SideMenu {...props}/>
});

//added event screen
const EventStack = StackNavigator({ EventList : { screen: Screens.Events } });
const EventDetailsStack = StackNavigator({ EventDetails : { screen: Screens.EventDetails } });

const AuthStack = StackNavigator({ SignIn: { screen: Screens.LoginV2 } });

const SwitchStack = SwitchNavigator(
  {
    AuthLoading: Screens.SplashScreen,
    App: AppStack,
    Event : EventStack,
    EventDetails : EventDetailsStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
);

export default class App extends React.Component {
  state = {
    loaded: false,
    signedIn: false,
    checkedSignIn: false,
    notification: {},
     messages: []
  };

  componentWillMount() {
  this._loadAssets();
  socket.emit('message', 'Hello world!');

   socket.on('message', (message) => {
   var oldMessages = this.state.messages;
  // React will automatically rerender the component when a new message is added.
   this.setState({ messages: oldMessages.concat(message) });
   });
  }
  _loadAssets = async() => {
    await Font.loadAsync({
      'fontawesome': require('./assets/fonts/fontawesome.ttf'),
      'icomoon': require('./assets/fonts/icomoon.ttf'),
      'Righteous-Regular': require('./assets/fonts/Righteous-Regular.ttf'),
      'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
      'Roboto-Medium': require('./assets/fonts/Roboto-Medium.ttf'),
      'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
      'Roboto-Light': require('./assets/fonts/Roboto-Light.ttf'),
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
      'Ionicons': require("@expo/vector-icons/fonts/Ionicons.ttf")
    });
    this.setState({loaded: true});
  };

  render() {
     console.log("this.state.messages", this.state.messages)
    if (!this.state.loaded) {
      return <AppLoading />;
    }

    return (
      <SwitchStack />
    );
  }
}

Expo.registerRootComponent(App);
