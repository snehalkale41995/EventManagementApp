import React from 'react';
import { RkText, RkStyleSheet } from 'react-native-ui-kitten';
import { Container } from 'native-base';
import { Image, ScrollView, View, StyleSheet, Alert, AsyncStorage, ActivityIndicator, Text, Linking, TouchableOpacity,Platform,NetInfo } from 'react-native';
import { scale, scaleModerate, scaleVertical } from '../../utils/scale';
import * as loginService from '../../serviceActions/login';
import QRCode from "react-native-qrcode";
import {Loader} from '../../components/loader';
import {Footer} from '../../components/footer';

function renderIf(condition, content) {
  if (condition) {
    return content;
  } else {
    return null;
  }
}
export class UserProfile extends React.Component {
  static navigationOptions = {
    title: 'Profile'.toUpperCase()
  };

  constructor(props) {
    super(props);
    this.state = {
      isOffline: false,
      userInfo :{},
      isLoaded: false,
    }
  }

  componentWillMount() {
    if (Platform.OS !== 'ios') {
      NetInfo.isConnected.fetch().then(isConnected => {
        if (isConnected) {
          this.getUserInfo();
        } else {
          this.setState({
            isOffline: true
          });
        }
        this.setState({
          isOffline: !isConnected
        });
      });
    }
     this.getUserInfo();
    NetInfo.addEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange
    );
  }

  handleFirstConnectivityChange = (connectionInfo) => {
    if (connectionInfo.type != 'none') {
      this.getUserInfo();
    } else {
      this.setState({
        isOffline: true
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

  getUserInfo(){
    loginService.getCurrentUser((userInfo)=>{
      if(userInfo){
        this.setState({
          userInfo : userInfo,
          isLoaded : true
        })
       }
      else{
        this.setState({isLoaded:false})
      }
    })
  }

    displayInformation = () => {
    let userInfo = this.state.userInfo;
    let attendeeCode = userInfo.attendeeLabel+"-"+userInfo.attendeeCount;
    let attendeeId = userInfo._id;
    let userName = userInfo.firstName +""+ userInfo.lastName;
    let qrText = "TIE" + ":" + attendeeCode + ":" + attendeeId + ":" + userName;
    return (
      <Container>
        <ScrollView style={styles.root}>
             <View style={styles.section}>
                <View style={[styles.column, styles.heading]}>
                  <RkText style={{color: '#E7060E',fontSize : 25, textAlign: 'center'}}>{userInfo.firstName + " " + userInfo.lastName}</RkText>
                  <RkText style={{fontSize : 20, textAlign: 'center'}} >{userInfo.briefInfo}</RkText>
                </View>
                <View style={[styles.row]}>
                   <QRCode
                   value={qrText}
                   size={160}
                   bgColor='black'
                   fgColor='white'/>  
                   </View>
                 <View style={{marginTop:10}}>
                   <RkText style={{fontSize : 15, textAlign: 'center'}}>{attendeeCode}</RkText>
                 </View>
                  <View style={{marginTop:25,backgroundColor:'#E7060E',height:40}}>
                   <RkText style={{fontSize : 25, textAlign: 'center', color:'white'}}>{userInfo.roleName}</RkText>
                 </View>
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
  section: {
    backgroundColor: theme.colors.screen.base,
    marginTop: 35
  },
 heading: {
      paddingBottom: 12.5
    },
  column: {
    flexDirection: 'column',
    borderColor: theme.colors.border.base,
    alignItems: 'center'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    borderColor :'black'
  }
}));
