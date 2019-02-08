import React, { Component } from 'react';
import { Image,Platform,Text, Button, View, TouchableOpacity, StyleSheet, AsyncStorage, ScrollView,ActivityIndicator,Alert,NetInfo } from 'react-native';
import { RkButton, RkStyleSheet, RkText, RkCard } from 'react-native-ui-kitten';
import { Icon, Container, Tabs, Tab, TabHeading } from 'native-base';
import { NavigationActions, TabNavigator, TabView } from 'react-navigation';
import Moment from 'moment';
import { Avatar } from '../../../components';
import styleConstructor, { getStatusStyle } from './styles';
import { GradientButton } from '../../../components/gradientButton';
import * as loginService from '../../../serviceActions/login';
import * as eventService from '../../../serviceActions/event';
import * as regResponseService from '../../../serviceActions/registrationResponse';
import * as questionFormService from '../../../serviceActions/questionForm';
import {Loader} from '../../../components/loader';
import {Footer} from '../../../components/footer';
import _ from 'lodash'
import { BackHandler } from 'react-native';

import withPreventDoubleClick from '../../../components/withPreventDoubleClick/withPreventDoubleClick';
const TouchableOpacityEx = withPreventDoubleClick(TouchableOpacity);

const userProfileAccess = ['Admin','Volunteer','Speaker'];
export class SessionDetails extends Component {
  static navigationOptions = {
    title: 'Session Details'.toUpperCase()
  };
  constructor(props) {
    super(props);
    this.styles = styleConstructor();
    this.sessionDetails = this.props.navigation.state.params.session;
      this.state = {
        eventId : "",
        sessionDetails: this.props.navigation.state.params.session,
        speakerDetails: this.sessionDetails.speakers,
        speakers: this.sessionDetails.speakers,
        sessionId: this.props.navigation.state.params.session.key,
        user: "",
        description: this.sessionDetails.description ? this.sessionDetails.description : this.sessionDetails.eventName,
        sessionName: this.sessionDetails.sessionName,
        sessionVenue: this.sessionDetails.room ? this.sessionDetails.room : "",
        startTime: this.sessionDetails.startTime,
        endTime: this.sessionDetails.endTime,
        userObj: {},
        regStatus: "",
        regId: "",
        currentSessionStart : Moment(this.sessionDetails.startTime).format(),
        currentSessionEnd  :  Moment(this.sessionDetails.endTime).format(),
        sameTimeRegistration : false,
        isOffline : false,
        isAddingToAgenda :false,
        isLoaded : false 
      }
  }
  handleBackPress=()=>{
    //console.log("Second:",this.props.navigation.state.routeName)
    this.props.navigation.pop(1); 
    return true;
  }

/**check */
componentWillMount() {
  BackHandler.addEventListener('hardwareBackPress',this.handleBackPress);

  if(Platform.OS !== 'ios'){
    NetInfo.isConnected.fetch().then(isConnected => {
      if(isConnected) {
        this.getCurrentUser();
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
  this.getCurrentUser();
  NetInfo.addEventListener(
    'connectionChange',
    this.handleFirstConnectivityChange
  );
}

handleFirstConnectivityChange = (connectionInfo) => {
  if(connectionInfo.type != 'none') {
    this.getCurrentUser();
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
  BackHandler.removeEventListener('hardwareBackPress',this.handleBackPress);
  NetInfo.removeEventListener(
    'connectionChange',
    this.handleFirstConnectivityChange
  );  
}

getCurrentUser() {
  let compRef = this;
  loginService.getCurrentUser((userDetails) => {
      eventService.getCurrentEvent((eventDetails)=>{
        this.setState({
        user: userDetails.firstName + " " + userDetails.lastName,
        userObj: userDetails,
        eventId : eventDetails._id
      });
      compRef.fetchRegistrationStatus();
      })
  })
  }

    onSurvey= ()=> {
    let eventId = this.state.eventId;
    let userId = this.state.userObj._id;
    let sessionId = this.state.sessionId;
    let today = Moment(new Date()).format();
    if (this.state.currentSessionStart <= today){
      questionFormService.getFeedbackResponse(eventId,sessionId,userId).
         then((response)=>{
        if(response.length===0){
        this.props.navigation.navigate('Survey', { sessionDetails: this.state.sessionDetails });
        }
       else{ Alert.alert("You have already given feedback for this session")}
      }).catch((error)=>{
       // console.warn(error);
      })
    }
     else {
      Alert.alert("Its too early ,wait till session ends");
    }
  }

  getSurveyAccess = () => {
      return (
        <View style={{ width:Platform.OS === 'ios' ? 320 : 380 ,alignItems:'center' , flexDirection : 'row' , marginLeft :Platform.OS === 'android' ? 20 : 0  }}>
          <View style={{ width: Platform.OS === 'ios' ? 160 : 180 ,alignItems:'center'}} >
            <GradientButton colors={['#f20505', '#f55050']} text='Panel Q&A' style={{width: Platform.OS === 'ios' ? 150 :170 , alignSelf : 'center'}}
              onPress={() => this.props.navigation.navigate('QueTab', { sessionDetails: this.state.sessionDetails })}
            />
          </View>
          <View style={{  width: Platform.OS === 'ios' ? 160 : 180 ,alignItems:'center'}} >
            <GradientButton colors={['#f20505', '#f55050']} text='Feedback' style={{  width: Platform.OS === 'ios' ? 150 :170 ,alignSelf : 'center'}}
              onPress={this.onSurvey}
            />
          </View>
        </View>
      );
  }

  getDuration = () => {
    let endTime = Moment(this.state.endTime).format("HH:mm");
    let startTime = Moment(this.state.startTime).format("HH:mm");
    let sessionDate = Moment(this.state.startTime).format("ddd, MMM DD, YYYY");
    return (<Text>{startTime} - {endTime} | {sessionDate} </Text>);
  }

  getSpeakers = () => {
    if (this.state.speakerDetails) {
      return this.state.speakerDetails
        .map((speaker, index) => {
          let avatar;
          if (speaker.profileImageURL) {
            avatar = <Avatar rkType='small' style={{ width: 44, height: 44, borderRadius: 20 }} imagePath={speaker.profileImageURL} />
          } else {
            avatar = <Image style={{ width: 44, height: 44, borderRadius: 20 }} source={require('../../../assets/images/defaultUserImg.png')} />
          }
          return (
            <TouchableOpacityEx key={index} onPress={() =>{  BackHandler.removeEventListener('hardwareBackPress',this.handleBackPress);
            this.props.navigation.navigate('SpeakerDetailsTabs', { speakerDetails: speaker, speakersId: speaker._id, eventId: this.state.eventId })}}>
              <View style={[styles.row, styles.heading, styles.speakerView]} >
                {avatar}
                <View style={styles.column}>
                  <RkText rkType='small'>{speaker.firstName + ' ' + speaker.lastName}</RkText>
                  <Text style={[styles.text, styles.speaker]} rkType='header6'>{speaker.briefInfo}</Text>
                </View>
                <RkText style={[styles.attendeeScreen]} ><Icon name="ios-arrow-forward" /></RkText>
              </View>
            </TouchableOpacityEx>
          )
        });
    }
  }

  attendRequestStatus = () => {
     if (this.state.regStatus) {
      if(this.state.sessionDetails.isRegistrationRequired){
        return (
          <View style = {[styles.attendBtn]}>
            <RkButton rkType='outline'
             onPress={this.onCancelRequest}
              style ={{borderColor : '#f20505',borderRadius : 30 , width : 100 ,height :30}}
              contentStyle={{ fontSize: 12 , color: '#f20505' }}
            >
                De-Register
              </RkButton>
          </View>
        )
      }
      else{
        return (
          <View style = {[styles.attendBtn]}>
            <RkButton rkType='outline'
              onPress={this.onCancelRequest}
              style ={{borderColor : '#f20505',borderRadius : 30 , width : 150 ,height :30}}
              contentStyle={{ fontSize: 12 , color: '#f20505' }}
            >
              {this.state.regStatus}
              </RkButton>
          </View>
        )
      } 
    }
    else if(this.state.sessionDetails.sessionType == 'invite'){
      return (
        <View style = {[styles.attendBtn]} >
          <RkText style={{ fontSize: 12 , color :'#f20505' }}>**By invitation only**</RkText>
        </View>
      );
    }
     else if(!this.state.regStatus  &&  this.state.sessionDetails.isRegistrationRequired){
      return (
        <View style = {[styles.attendBtn]} >
          <RkButton
            rkType='outline'
            style ={{borderColor : '#f20505', borderRadius : 30 , width : 100 ,height :30}}
            contentStyle={{ fontSize: 12 , color :'#f20505' }}
            onPress={this.onAttendRequest}
            >
            Register
            </RkButton>
        </View>
      );
    }
    else{
      return (
        <View style = {[styles.attendBtn]} >
          <RkButton
            rkType='outline'
            style ={{borderColor : '#f20505', borderRadius : 30 , width : 150 ,height :30}}
            contentStyle={{ fontSize: 12 , color :'#f20505' }}
             onPress={this.onAttendRequest}  
            >
            Add to My Agenda
            </RkButton>
        </View>
      );
    }
  }
  
  onAttendRequest = (event) => {
    this.setState({
      isAddingToAgenda : true
    });
    let today =new Date();
    if(Moment(new Date()).isBefore( Moment(this.state.sessionDetails.endTime))){
      if(this.state.sameTimeRegistration == true){
        this.setState({
          isAddingToAgenda : false
        });
        Alert.alert("Already registered for same time in other session");
      }
      else{
        let  attendRequest = {
         user : this.state.userObj._id,
         session : this.state.sessionId,
         event : this.state.eventId,
         registrationTime : new Date(),
         status : this.state.sessionDetails.isRegistrationRequired ? 'De-Register' : 'Remove From Agenda'
        }
        regResponseService.addRegResponse(attendRequest).then((response) => {
          this.setState({
            regId: response._id,
            regStatus: response.status,
            isAddingToAgenda : false
          });
        }).catch((error) => {
          this.setState({
            isAddingToAgenda : false
          })
        });
      }
    }
    else{
      this.setState({
        isAddingToAgenda : false
      });
      Alert.alert("You cannot add past session to Agenda");
    }
  }

  onCancelRequest = (event) => {
    this.setState({
      isAddingToAgenda : true
    });
    regResponseService.deleteRegResonse(this.state.regId).then((response)=>{
          this.setState({
          regStatus: "",
          regId: "",
          isAddingToAgenda : false
        })
    }).catch((error)=>{
       this.setState({
          isAddingToAgenda : false
        })
    })
}

   fetchRegistrationStatus = () => {
      let compRef = this;
      let attendeeId = this.state.userObj._id;
      let eventId = this.state.eventId;
      let sessionId = this.state.sessionDetails.key;
      if(this.state.userObj){
      regResponseService.getRegResponseBySessionUser(eventId,sessionId,attendeeId).
      then((response)=>{
        if(response.length>0){
         let regResponse = response[0];
         compRef.setState({
            regStatus: regResponse.status,
            regId: regResponse._id,
            isLoaded : true
          })
        }
        else{
          compRef.setState({
            regStatus: "",
            regId: ""
          })
       
         if(compRef.state.sessionDetails.isRegistrationRequired){
           compRef.checkAlreadyRegistered();
         }
         else{
             compRef.setState({
             isLoaded : true
          })
         }
        }
      }).catch(()=>{
        this.setState({isLoaded:false})
      })
    }
  }

    checkAlreadyRegistered = () => {
    let compRef = this;
    let sameTimeRegistration;
    let eventId = this.state.eventId;
    let userId = this.state.userObj._id;
    let sessionId = this.state.sessionId;
    let currentSessionStart = compRef.sessionDetails.startTime;
    let currentSessionEnd = compRef.sessionDetails.endTime;
   
    regResponseService.getRegResponseByEventUser(eventId, userId).
      then((response)=>{
        response.forEach((data)=>{
           let regSession = data.session;

           if(regSession.isRegistrationRequired){

            let isSameStart = Moment(currentSessionStart).isSame(Moment(regSession.startTime));
            let isSameEnd = Moment(currentSessionEnd).isSame(Moment(regSession.endTime));
            let isBetweenStart =  Moment(currentSessionStart).isBetween(Moment(regSession.startTime),Moment(regSession.endTime));
            let isBetweenEnd = Moment(currentSessionEnd).isBetween(Moment(regSession.startTime),Moment(regSession.endTime));
            let isBetweenStartOld = Moment(regSession.startTime).isBetween(Moment(currentSessionStart),Moment(currentSessionEnd));
            let isBetweenEndOld = Moment(regSession.endTime).isBetween(Moment(currentSessionStart),Moment(currentSessionEnd));
           let alreadyReg = isSameStart || isSameEnd || isBetweenStart ||isBetweenEnd||isBetweenStartOld ||isBetweenEndOld;
          
           if(alreadyReg && regSession._id !== compRef.state.sessionId) {
               sameTimeRegistration = true}
           }
          })
            if(sameTimeRegistration === true){
             compRef.setState({
                  sameTimeRegistration: true,
                  isLoaded : true
                });
            }
              else {
                compRef.setState({
                  regStatus: "",
                  regId: "",
                  isLoaded : true
                })
              }
      }).catch((error) => {
          compRef.setState({
          isLoaded : true
        })
      })
  }

  render() {
    let myAgendaView = this.props.navigation.state.params.myAgendaView? this.props.navigation.state.params.myAgendaView : false  ;
    const speakers = this.getSpeakers();
    const displaySpeakers = (this.state.speakerDetails) ? (
        <View style={styles.speakerSection}>
              <View style={[styles.heading]}>
                <View style={[styles.row]}>
                  <RkText style={{ marginLeft: 5, fontSize: 16 }} ><Icon name="md-people" /> </RkText>
                  <RkText style={{ marginLeft: 5, fontSize: 16 }} rkType='header6 primary' >Speakers </RkText>
                </View>
              </View>
              {speakers}
        </View>
      ): (<View></View>);

     const surveyButton = this.getSurveyAccess();
        if(this.state.isAddingToAgenda){
          return(
         <Container style={[styles.root]}>
              <Loader/> 
              <View>
              <Footer isOffline ={this.state.isOffline}/> 
              </View>
             </Container>
          )
        }
        else if(this.state.isLoaded){
        let currentUserRole = this.state.userObj.roleName;
          return(
            <Container style={styles.root}>
        <ScrollView style={styles.root}>
            <View style={styles.section}>
              <View style={[styles.row, styles.heading]}>
                <RkText style={{ fontSize: 20 }} rkType='header6 primary'>{this.state.sessionDetails.sessionName}</RkText>
              </View>
            </View>
            <View style={styles.subSection}>
              <View style={[styles.row, styles.heading]}>
                <Text style={{flexDirection : 'column',width: 25, fontSize: 12, marginTop:1, color: '#5d5e5f' }}><Icon name="md-time" style={{fontSize: 18, color: '#5d5e5f'}}/></Text>
                <Text style={{flexDirection : 'column'}} rkType='header6' style={{color: '#5d5e5f'}}> {this.getDuration()} </Text> 
              </View>
              <View style={[styles.row, styles.heading]}>
                <RkText style={{flexDirection : 'column',width: 25, fontSize: 12, marginTop:10 }}><Icon name="md-pin" style={{fontSize: 18, marginTop:5, color: '#5d5e5f'}}/></RkText>
                <Text style={{flexDirection : 'column'}} rkType='header6' style={{marginTop:10, marginLeft:3, color: '#5d5e5f'}}>{this.state.sessionVenue.roomName}</Text>
              </View>
               <View>
                {
                  userProfileAccess.indexOf(currentUserRole) === -1 && !myAgendaView? this.attendRequestStatus() : null
                }
              </View> 
            </View>
            <View style={styles.descSection}>
              <View style={[styles.row, styles.heading]}>
                <RkText rkType='header6'>Summary: </RkText>
            </View>
              <View style={[styles.row]}>
                <Text style={[styles.text, styles.justify]}>{this.state.description}</Text>
              </View>
            </View>
             {displaySpeakers} 
        </ScrollView>
        <View style={[styles.surveButton]}>
         {
          userProfileAccess.indexOf(currentUserRole) === -1 ? surveyButton : null
         }
        </View> 
       <View>
        <Footer isOffline ={this.state.isOffline}/>    
        </View>
      </Container>
          )
        }
        else{
          return(
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
  section: {
    marginVertical: 25,
    marginBottom: 10
  },
  descSection: {
    marginVertical: 25,
    marginBottom: 10,
    marginTop: 5
  },
  speakerSection: {
    marginVertical: 25,
    marginBottom: 10,
    marginTop: 5
  },
  subSection: {
    marginTop: 5,
    marginBottom: 10
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 17.5,
    borderColor: theme.colors.border.base,
    alignItems: 'center'
  },
  column:{
    flexDirection : 'column',
    marginLeft: 10
  },
  justify:{
    textAlign: 'justify'
  },
  text: {
    marginBottom: 5,
    fontSize: 15,
  },
  surveButton: {
    alignItems: 'center',
    flexDirection: 'column',
    width: Platform.OS === 'ios' ? 320 : 380,
    marginTop: 3,
    marginBottom: 3,
    alignSelf : 'center'
  },
  speakerView: {
    marginTop: 5,
    marginBottom: 5
  },
  speaker: {
    flexDirection: 'column',
    width: Platform.OS === 'ios' ? 225 : 250,
  },
  attendeeScreen: {
    flexDirection: 'column',
    fontSize: 25,
    marginRight: 5,
    alignItems : 'flex-end'
  },
  avatar: {
    backgroundColor: '#C0C0C0',
    width: 40,
    height: 40,
    borderRadius: 20,
    textAlign: 'center',
    fontSize: 20,
    textAlignVertical: 'center',
    marginRight: 5
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 5
  },
  attendBtn : {
    flexDirection: 'column',
    alignItems : 'flex-end',
    marginRight : 10,
    marginTop : -10
  }
}));
