import React from 'react';
import { TouchableHighlight, View, ScrollView, Image, Platform, StyleSheet, Alert,ImageBackground } from 'react-native';
import {NavigationActions} from 'react-navigation';
import { RkStyleSheet, RkText, RkTheme } from 'react-native-ui-kitten';
import {MainRoutes} from '../../config/navigation/routes';
import { Icon } from "native-base";
import _ from 'lodash';
import {FontAwesome, FontIcons} from '../../assets/icons';
import { AsyncStorage } from 'react-native';
import * as eventService from '../../serviceActions/event';
export class SideMenu extends React.Component {

  constructor(props) {
    super(props);
    this._navigateAction = this._navigate.bind(this);
    this.state = {
      userDetails: {},
      eventDetails : {},
      eventName : " "
    }
  }
  
  componentWillMount() {
  this.setUserEventDetails();
  }
 
  componentWillReceiveProps(nextProps) {
    this.setEventName();
  }

  setUserEventDetails(){
     AsyncStorage.getItem("USER_DETAILS").then((userDetails)=>{
      eventService.getCurrentEvent((eventDetails)=>{
       this.setState({
         userDetails: JSON.parse(userDetails),
         eventDetails : eventDetails,
         eventName : eventDetails.eventName.toUpperCase()
        });
      })
      })
      .catch(err => {
        //console.warn('Errors');
      });
  }

  //To avoid multiple setState call
 setEventName(){
   AsyncStorage.getItem("EVENT_DETAILS").then((eventDetails)=>{
    let eventInfo = JSON.parse(eventDetails);
    let selectedEvent = eventInfo.eventName;
    let currentStateEvent = this.state.eventDetails.eventName;
      if(selectedEvent!== currentStateEvent){
        this.setState({
         eventDetails : eventInfo,
         eventName : eventInfo.eventName.toUpperCase()
        });
        }
   })
 }
   

  _navigate(route) {
    let resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({routeName: route.id})
      ]
    });
    this.props.navigation.dispatch(resetAction)
  }

  _renderIcon() {
    if (RkTheme.current.name === 'light')
      return <Image style={styles.icon} source={require('../../assets/images/smallLogo.png')}/>;
    return <Image style={styles.icon} source={require('../../assets/images/smallLogo.png')}/>
  }

  _onLogout() {
    let navigation = this.props.navigation;
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Yes', onPress: () => {
              let keysToRemove = ['USER_DETAILS', 'USER_LINKEDIN_TOKEN', 'SESSIONS'];
              AsyncStorage.multiRemove(keysToRemove, (err) => {});
              navigation.navigate('Auth');
          } 
        },
        { text: 'No', onPress: () => {}},
      ],
      { cancelable: false }
    );
  }

  render() {
    let menu = MainRoutes.map((route, index) => {
      if (this.state.userDetails && this.state.userDetails.roleName && route.roleNames) {
        let foundIndex = route.roleNames.indexOf(this.state.userDetails.roleName);
        if(foundIndex == -1){
          return null;
        }
      }

      return (
          <TouchableHighlight
            style={styles.container}
            key={route.id}
            underlayColor={RkTheme.current.colors.button.underlay}
            activeOpacity={1}
            onPress={() => this._navigateAction(route)}>
            <View style={styles.content}>
              <View style={styles.content}>
                <RkText style={[styles.icon, styles.sidebarIcon]}
                        rkType='moon primary xlarge'><Icon name={route.icon}/></RkText>
                <RkText style={styles.sidebarMenuName}>{route.title}</RkText>
              </View>
              <RkText rkType='awesome secondaryColor small' style={styles.rightIcon}>{FontAwesome.chevronRight}</RkText>
            </View>
          </TouchableHighlight>
      )
    });

    return (
      <View style={styles.root}>
        <ScrollView
          showsVerticalScrollIndicator={false}>
          <View style={{    borderTopWidth: StyleSheet.hairlineWidth,alignContent:'center',justifyContent:'center'}}>
            {/* {this._renderIcon()} */}
            <ImageBackground
              source={require('../../assets/images/profileBack.png')}
              imageStyle=''
              style={{width:'100%',height:150}} >    
              <View style={{flexDirection:'column',alignContent:'center',justifyContent:'center',paddingTop:10,paddingLeft:8}}>
              {this.state.eventDetails.eventLogo?<Image
                style={{width: 60, height: 60}}
                source={{uri: this.state.eventDetails.eventLogo}}
              />:null}
                <RkText style={styles.tieName}>{this.state.eventName}</RkText>
                <RkText style={{fontSize:14,color:'#000'}}>{this.state.eventDetails.venue}</RkText>

                </View>
                
            </ImageBackground>
          </View>
          {menu}
          <TouchableHighlight
            style={styles.container}
            key={'Logout'}
            underlayColor={RkTheme.current.colors.button.underlay}
            activeOpacity={1}
            onPress={ this._onLogout.bind(this) }>
            <View style={styles.content}>
              <View style={styles.content}>
                <RkText style={[styles.icon, styles.sidebarIcon]}
                        rkType='moon primary xlarge'><Icon name="ios-exit"/></RkText>
                <RkText style={styles.sidebarMenuName}>Logout </RkText>
                <RkText style={styles.sidebarMenuName}> {this.state.userDetails.firstName}</RkText>

              </View>
              <RkText rkType='awesome secondaryColor small' style={styles.rightIcon}>{FontAwesome.chevronRight}</RkText>
            </View>
          </TouchableHighlight>
        </ScrollView>
      </View>
    )
  }
}

let styles = RkStyleSheet.create(theme => ({
  container: {
    height: 40,
    paddingHorizontal: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border.base
  },
  root: {
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
    backgroundColor: theme.colors.screen.base
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 13,
  },
   tieName: {
    fontSize: 16,
    color:'#990000'    
  },
  sidebarIcon:{
    fontSize: 13,
    color: '#607B8C',
    width:30,
  },
  sidebarMenuName: {
    fontSize: 14,
    color: '#607B8C',
  },
  rightIcon:{
     color: '#607B8C',
  }
}));