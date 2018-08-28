import React from 'react';
import moment from 'moment';
import { ScrollView, Platform, Image, NetInfo } from 'react-native';
import { Text, View, Icon, Container, Label } from 'native-base';
import { StyleSheet, FlatList, TouchableOpacity, Keyboard, Alert, AsyncStorage, ActivityIndicator } from 'react-native';
import { RkComponent, RkTheme, RkStyleSheet, RkText, RkAvoidKeyboard, RkButton, RkCard, RkChoice, RkTextInput, RkChoiceGroup } from 'react-native-ui-kitten';
import * as loginService from '../../serviceActions/login';
import { GradientButton } from '../../components/gradientButton';

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
    let event = this.state.event;
     let avatar;
            if (event.eventLogo) {
                avatar = <Image style={{ width: 60, height: 60 }} source={{ uri: event.eventLogo }} />
            } else {
                avatar = <Image style={{ width: 60, height: 60 }} source={require('../../assets/images/defaultSponsorImg.png')} />
            }
    return (
     <View>
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
                         <View style={{flexDirection : 'row', marginTop: 10}}> 
                          <Text style={styles.infoText}>{event.description}</Text>  
                         </View>
                        </View>
                    </RkCard>
         <GradientButton colors={['#E7060E', '#f55050']} rkType='large' text='JOIN' onPress={() => this._authenticateUser()} /> 
     </View>
    );
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
        height : 200
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
     iconStyle : {
    color: '#ed1b24',
    fontSize: 15
  },
  iconHeader : {
    fontSize: 35,
    marginLeft: 15,
    marginRight: 20,
    color : '#fff'
  }
}));