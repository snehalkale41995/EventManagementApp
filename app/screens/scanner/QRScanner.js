import React from 'react';
import { LayoutAnimation, Alert, Text, View, TouchableOpacity, Image, Dimensions, Keyboard, ActivityIndicator, AsyncStorage, NetInfo } from 'react-native';
import { RkButton, RkText, RkTextInput, RkStyleSheet, RkTheme, RkAvoidKeyboard } from 'react-native-ui-kitten';
import { FontAwesome } from '../../assets/icons';
import { GradientButton } from '../../components/gradientButton';
import { scale, scaleModerate, scaleVertical } from '../../utils/scale';
import { Platform, Vibration, StyleSheet } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { BarCodeScanner, Permissions } from 'expo';
import { Container, Header, Title, Content, Button, Icon, Right, Body, Left, Picker, ListItem } from "native-base";
import * as eventService from "../../serviceActions/event";
import * as loginService from "../../serviceActions/login";
import * as sessionService from "../../serviceActions/session";
import * as regResponseService from "../../serviceActions/registrationResponse";
import * as attendanceService from "../../serviceActions/attendance";

const Item = Picker.Item;

function renderIf(condition, content) {
  if (condition) {
    return content;
  } else {
    return null;
  }
}
export class QRScanner extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Scanner'.toUpperCase(),
  });

  constructor(props) {
    super(props);
    this.state = {
      hasCameraPermission: null,
      isErrorDisplayed: false,
      selectedItem: undefined,
      selectedSession: "",
      isLoading: true,
      sessions: [],
      lastScannedResult: '',
      lastScannedUserCode: '',
      sessionUsers: [],
      isOffline: false,
      sessionCapacity: 0,
      sessionDelegateAttendance: 0,
      sessionOtherAttendance: 0,
      loggedInUser: {},
      loggedInUserId: "",
      eventId: "",
      results: {
        items: []
      }
    };
    this._getCurrentSessionUsers = this._getCurrentSessionUsers.bind(this);
    this.subscribeToSessionUpdate = this.subscribeToSessionUpdate.bind(this);
    this._getSesssionsFromServer = this._getSesssionsFromServer.bind(this);
  }
  
 _getCurrentEventUser(){
    let compRef = this;
    loginService.getCurrentUser(userDetails => {
      eventService.getCurrentEvent(eventDetails => {
        this.setState({
          loggedInUser: userDetails,
          loggedInUserId: userDetails._id,
          eventId: eventDetails._id
        });
         compRef._getSesssionsFromServer(eventDetails._id);
      });
    });
 }

 _getSesssionsFromServer(eventId) {
    let thisRef = this;
    let sessions = [];  
   sessionService.getSessionsByEvent(eventId).then((response)=>{
     response.forEach((sessionData)=>{
       if(sessionData.sessionType !== "common"){
        sessionData['sessionName'] = sessionData.sessionName + '(' + sessionData.room.roomName + ')';
        sessions.push(sessionData);  
       }
     })
    if (sessions.length > 0) {
        let selectedSession = sessions[0];
       
        thisRef.setState({ sessions, selectedSession: selectedSession._id, sessionCapacity: selectedSession.sessionCapacity });
        thisRef._getCurrentSessionUsers(sessions[0]._id, eventId);
        thisRef.subscribeToSessionUpdate(sessions[0]._id, eventId); 
        thisRef._getOtherSessionAttendance(selectedSession, eventId);
      } else {
        thisRef.setState({ error: 'No sessions configured on server. Please contact administrator.', isLoading: false });
      }
   }).catch((error)=>{
      thisRef.setState({ error: 'Error getting Sessions from server. Please contact adminstrator.', isLoading: false })
      Alert.alert(
        'Error',
        'Unable to get sessions information. Please try again.',
        [
          { text: 'Ok', onPress: () => { } },
        ],
        { cancelable: false }
      );
   })
}
  
  componentWillMount() {
    this._requestCameraPermission();
    let thisRef = this;
    NetInfo.isConnected.fetch().then(isConnected => {
      if(isConnected) {
        this.setState({
          isLoading: true
        });
        this._getCurrentEventUser();  
      } else {
        this.setState({
          isLoading: false
        });
      }
      this.setState({
        isOffline: !isConnected
      });
    });  
    NetInfo.addEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange
    );
  }

  handleFirstConnectivityChange = (connectionInfo) => {
    if(connectionInfo.type != 'none') {
        this.setState({
          isLoading: true
        });
        this._getCurrentEventUser();
    } else {
      this.setState({
        isLoading: false
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

  _requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted',
    });
  };

  _getOtherSessionAttendance = (selectedSession, eventId) =>{
    let thisRef = this;
    attendanceService.getAttendance(selectedSession, eventId).then((otherSessionAttendance)=>{
      thisRef.setState({ otherSessionAttendance, isLoading: false });
    }).catch((error)=>{
      thisRef.setState({ isLoading: false });
    })
  }


  _getSelectedSession = () => {
    let session = _.find(this.state.sessions, { '_id': this.state.selectedSession });
    return session;
  }

  _updateUserData(scannedUserId, userCode, event_Id) {
    let otherSessionAttendance = this.state.otherSessionAttendance;
    let compRef = this;
    if (this.state.lastScannedResult != scannedUserId && !this.state.isLoading) {
      let selectedSession = this._getSelectedSession();
      let parsedUserCode = userCode.split("-");
      if (parsedUserCode.length == 1) {
        parsedUserCode.push("");
      }
      let attendanceObj = { event: this.state.eventId, session: this.state.selectedSession, userId: scannedUserId, userType: parsedUserCode[0], scannedBy: this.state.loggedInUserId, time: new Date()};
      this.setState({
        isLoading: true,
        lastScannedResult: scannedUserId,
        lastScannedUserCode: userCode
      });

     if(otherSessionAttendance.length >0 && parsedUserCode[0] == "DEL" && otherSessionAttendance.indexOf(scannedUserId) !== -1){
      this.setState({ isLoading: false });  
      Alert.alert("This user is already marked as present for another session");
     }
      else{
      if (selectedSession.isRegistrationRequired && parsedUserCode[0] == "DEL" && this.state.sessionUsers.indexOf(scannedUserId) == -1) {
        Alert.alert(
          "Unregistered User",
          "This user is not registered for this session. Do you still want to continue?",
          [
            {
              text: "Yes",
              onPress: () => {
                compRef.checkForSessionCapacity(attendanceObj);
              }
            },
            {
              text: "No",
              onPress: () => {
                this.setState({ isLoading: false });
              }
            }
          ],
          { cancelable: false }
        );
      }
      else {
        compRef.checkForSessionCapacity(attendanceObj);
      }
    }
    } else {
     // console.warn("already scanned");
    }
  }


 checkForSessionCapacity= (attendanceObj) =>{
   let compRef = this;
     if(this.state.sessionDelegateAttendance + this.state.sessionOtherAttendance>=this.state.sessionCapacity){
         Alert.alert(
          "Capacity Fullfilled",
          "Session Capacity is fullfilled. Do you still want to continue?",
          [
            {
              text: "Yes",
              onPress: () => {
               compRef.markUserAttendance(attendanceObj);
              }
            },
            {
              text: "No",
              onPress: () => {
                this.setState({ isLoading: false });
              }
            }
          ],
          { cancelable: false }
        );
      }
      else{
        compRef.markUserAttendance(attendanceObj);
      }
 }

  markUserAttendance=(attendanceObj)=>{
    let compRef = this;
    attendanceService
      .markAttendance(attendanceObj)
      .then(response => {
        compRef.setState({ isLoading: false });
        Vibration.vibrate(200);
      })
      .catch(error => {
        compRef.setState({ isLoading: false });
        Alert.alert(
          "Error",
          "Unable to update attendance. Please try again.",
          [{ text: "Ok", onPress: () => {} }],
          { cancelable: false }
        );
      });
  }

  _validateQRData(data) {
    if (data.startsWith('TIE:')) {
      let parsedData = data.split(":");
      if(parsedData.length == 4){
        if(parsedData[1] === this.state.eventId){
           this.checkForDuplicateScan(parsedData[3], parsedData[2], parsedData[1]);
        }
        else {
        this.displayInvalidUserError();
      }
      } else {
        this.displayInvalidQrError();
      }
    } else {
     this.displayInvalidQrError();
    }
  }
  
  checkForDuplicateScan=(scannedUserId, userCode, event_Id)=>{
   if (this.state.lastScannedResult != scannedUserId && !this.state.isLoading) {
    let selectedSessionId = this.state.selectedSession;
     attendanceService
      .checkAlreadyScanned(selectedSessionId, scannedUserId)
      .then(response => {
        if(response.length>0){
           this.displayAlreadyScannedError();
        }
        else{
        this._updateUserData(scannedUserId, userCode, event_Id);
        }
      }).catch((error)=>{
       // console.warn(error)
      })
   }
  }

  displayAlreadyScannedError=()=>{
    this.setState({ isErrorDisplayed: true, isLoading: false });
      Alert.alert(
        'Already Present',
        'This User is already marked as Present',
        [
          {
            text: 'Ok', onPress: () => {
              this.setState({ isErrorDisplayed: false });
            }
          },
        ],
        { cancelable: false }
      );
  }

  displayInvalidUserError=()=>{
    this.setState({ isErrorDisplayed: true, isLoading: false });
      Alert.alert(
        'Unregistered User',
        'This User is not registered for this Event',
        [
          {
            text: 'Ok', onPress: () => {
              this.setState({ isErrorDisplayed: false });
            }
          },
        ],
        { cancelable: false }
      );
  }

  displayInvalidQrError=()=>{
    this.setState({ isErrorDisplayed: true, isLoading: false });
      Alert.alert(
        'Invalid Data',
        'This QR code is not valid TiE QR Code.',
        [
          {
            text: 'Ok', onPress: () => {
              this.setState({ isErrorDisplayed: false });
            }
          },
        ],
        { cancelable: false }
      );
  }

  _handleBarCodeRead = result => {
    if (this.state.isErrorDisplayed == false) {
      LayoutAnimation.spring();
      this._validateQRData(result.data);
    }
  };
  
  _getCurrentSessionUsers(selectedSessionId, eventId) {
    let thisRef = this;
    let sessionUsers = [];
    regResponseService.getRegResponseByEventSession(eventId, selectedSessionId).then((response)=>{
      if(response.length>0){
       response.forEach((sessionData)=>{
         sessionUsers.push(sessionData.user._id); 
       }) 
      }
       thisRef.setState({ sessionUsers, isLoading: false });
      
    }).catch((error)=>{
      thisRef.setState({ isLoading: false });
      Alert.alert(
        'Error',
        'Unable to get users for selected session. Please try again.',
        [
          { text: 'Ok', onPress: () => { } },
        ],
        { cancelable: false }
      ); 
    })
  }

  subscribeToSessionUpdate(selectedSessionId, eventId) {
  let thisRef = this; 
      attendanceService
      .getUserCount(eventId,selectedSessionId)
      .then(response => {
      var attendance = [], delegateAttedance = 0, otherAttendance = 0;
      response.forEach(function(data) {
        let attendanceDetails = data;
        if(attendanceDetails.userType == "DEL"){
          delegateAttedance++;
        } else {
          otherAttendance++;
        }
        attendance.push(attendanceDetails);
      });
      thisRef.setState({sessionDelegateAttendance: delegateAttedance, sessionOtherAttendance: otherAttendance});
      })
  }

  onConfChange(selectedSessionId) {
  let eventId = this.state.eventId;
    let session = _.find(this.state.sessions, { '_id': selectedSessionId });
    let sessionCapacity = session.sessionCapacity ? session.sessionCapacity : 'NA';
    this.setState({
      selectedSession: selectedSessionId,
      isLoading: true,
      lastScannedResult: '',
      sessionCapacity: sessionCapacity
    });
    this._getCurrentSessionUsers(selectedSessionId, eventId);
    this.subscribeToSessionUpdate(selectedSessionId, eventId);
    this._getOtherSessionAttendance(session, eventId);
  }

  getView = () => {
    if(this.state.hasCameraPermission === null){
      return (
        <RkText>Requesting for camera permission...</RkText>
      );
    } else {
      if(this.state.hasCameraPermission === false) {
        return (
          <RkText>
            Camera permission is not granted.
          </RkText>
        );
      } else {
        if(this.state.isOffline) {
          return (
            <RkText>
              The Internet connection appears to be offline.
            </RkText>
          );
        } else if(this.state.error) {
          return (
            <RkText>
              {this.state.error}
            </RkText>
          );
        } else {
          return (
            <View>
              <BarCodeScanner
                style={styles.barCode}
                onBarCodeRead={this._handleBarCodeRead}
                style={{
                  height: (Dimensions.get('window').height - (Platform.OS === 'ios' ? 190 : 220)),
                  width: (Dimensions.get('window').width - 20),
                }}
              />
              <View style={styles.scanResults}>
                <RkText>
                  {this.state.lastScannedUserCode}
                </RkText>
              </View>
            </View>
          );
        }
      }
    }
  }

  renderPicker = (sessionItems) => {
    if(Platform.OS == 'ios') {
      return (
        <View style={styles.container}>
          <Picker
              note
              iosHeader="Select Session"
              placeholder="Select Session"
              headerStyle={{ backgroundColor: "#ed1b24" }}
              headerBackButtonTextStyle={{ color: "#fff" }}
              headerTitleStyle={{ color: "#fff" }}
              iosIcon={<Icon name="ios-arrow-down-outline" />}
              mode="dropdown"
              selectedValue={this.state.selectedSession}
              onValueChange={this.onConfChange.bind(this)}
            >
                {sessionItems}
          </Picker>
        </View>
      )
    } else {
      return (
        <ListItem icon>
            <Left>
              <Text>Select Session</Text>
            </Left>
            <Body>
              <Picker
                note
                mode="dropdown"
                selectedValue={this.state.selectedSession}
                onValueChange={this.onConfChange.bind(this)}
              >
                {sessionItems}
              </Picker>
            </Body>
        </ListItem>
      );
    }
  }

  renderSessionDropdown = () => {
    if(this.state.isOffline || this.state.error) {
      return null;
    }

    let sessionItems = this.state.sessions.map(function (session, index) {
      return (
        <Text ellipsizeMode='tail' style={styles.text} numberOfLines={1} key={index} label={session.sessionName} value={session._id} />
      )
    });
    return (
      <View>
        { this.renderPicker(sessionItems)}
          <View style={[styles.userCode, styles.bordered]}>
          <View style={styles.section}>
            <RkText rkType='header3' style={styles.space}> {this.state.sessionDelegateAttendance} / {this.state.sessionCapacity}</RkText>
            <RkText rkType='secondary1 hintColor'>Attendance</RkText>
          </View>
          <View style={styles.section}>
            <RkText rkType='header3' style={styles.space}> {this.state.sessionOtherAttendance} </RkText>
            <RkText rkType='secondary1 hintColor'>Others</RkText>
          </View>
        </View> 
      </View> 
    );
  }

  render() {
    return (
      <RkAvoidKeyboard
        style={styles.screen}
        onStartShouldSetResponder={(e) => true}
        onResponderRelease={(e) => Keyboard.dismiss()}>
         {this.renderSessionDropdown()} 
         <View>
          {this.getView()}
        </View> 
         {renderIf(this.state.isLoading,
          <View style={styles.loading}>
            <ActivityIndicator size='large' />
          </View>
        )} 
      </RkAvoidKeyboard>
    );
  }
}

let styles = RkStyleSheet.create(theme => ({
  section: {
    flex: 1,
    alignItems: 'center'
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 3,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border.base,
    alignItems: 'center'
  },
  userCode: {
    flexDirection: 'row',
    paddingVertical: 2,
  },
  bordered: {
    borderBottomWidth: 1,
    borderColor: theme.colors.border.base
  },
  space: {
    marginBottom: 1
  },
  screen: {
    padding: 10,
    flex: 1,
    backgroundColor: theme.colors.screen.base
  },
  container: {
    flexDirection: 'row',
    padding: 0
  },
  text: {
    flex: 1
  },
  barCode: {
    padding: 10,
  },
  scanResults:{
    alignItems: 'center'
  },
  loading: {
    position: 'absolute',
    left: 0,
    backgroundColor: 'black',
    opacity: 0.8,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
}));