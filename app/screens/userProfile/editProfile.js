import React from 'react';
import { RkText, RkStyleSheet } from 'react-native-ui-kitten';
import { Container } from 'native-base';
import { Image, TextInput,ScrollView, View, StyleSheet, Alert, AsyncStorage, ActivityIndicator, Text, Linking, TouchableOpacity,Platform,NetInfo ,TouchableHighlight,ToastAndroid } from 'react-native';
import { scale, scaleModerate, scaleVertical } from '../../utils/scale';
import * as loginService from '../../serviceActions/login';
import QRCode from "react-native-qrcode"; 
import {Loader} from '../../components/loader';
import {Footer} from '../../components/footer';
import { GradientButton } from '../../components/gradientButton';
import { TextField } from 'react-native-material-textfield';
import { getEventById } from '../../serviceActions/event';
import axios from "axios";
import {Avatar} from '../../components';
import { BackHandler } from 'react-native';
import { Icon } from "native-base";


import AppConfig from "../../constants/AppConfig";
// import ImagePicker from 'componentsve-imagepicker'
import { ImagePicker,Permissions } from 'expo';

function renderIf(condition, content) {
  if (condition) {
    return content;
  } else {
    return null;
  }
}
export class editProfile extends React.Component {
  static navigationOptions = {
    title: 'Edit Profile'.toUpperCase()
  };

  constructor(props) {
    super(props);
    this.state = {
      isOffline: false,
      userInfo :{},
      isLoaded: false,
      fnameError:'',
      lnameError:'',
      contactError:'',
      emailError:''
    }
  }
  handleBackPress=()=>{
    this.props.navigation.replace('MyProfile');
    return true;        
}
  askPermissionsAsync = async () => {
    await Permissions.askAsync(Permissions.CAMERA);
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    
    };
    componentDidMount(){
      this.askPermissionsAsync();
    }
  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

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
  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 4],
    });
    if (!result.cancelled) {
      newUserInfo={...this.state.userInfo};
      newUserInfo.profileImageURL=result.uri;
      this.setState({ userInfo:{...newUserInfo}});


    }
  };

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
    BackHandler.removeEventListener('hardwareBackPress',this.handleBackPress);

    NetInfo.removeEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange
    );
  } 
  editInput=(field,val,event)=>{ 
    switch(field){
        case 'fname':
            user={...this.state.userInfo};
            user.firstName=val;
            this.setState({userInfo:user})
        break; 
        case 'lname':
            user={...this.state.userInfo};
            user.lastName=val;
            this.setState({userInfo:user})
        break;
        case 'contact':
            user={...this.state.userInfo};
            user.contact=val;
            this.setState({userInfo:user})
        break;
        case 'facebook':
            user={...this.state.userInfo};
            user.facebookProfileURL=val;
            this.setState({userInfo:user})
        break;
        case 'linkedin':
            user={...this.state.userInfo};
            user.linkedinProfileURL=val;
            this.setState({userInfo:user});
        break;
        case 'twitter':
            user={...this.state.userInfo};
            user.twitterProfileURL=val;
            this.setState({userInfo:user})

        break;
    }
  }
  submit=()=>
  {
    let user={...this.state.userInfo};
    if(user.profileImageURL==null){
      user.profileImageURL='';
    }
    if(this.validate(user.firstName,user.lastName,user.contact.toString())){
        delete user._id;
        delete user.__v;
        if(user.roleName==='Speaker'){
          axios
        .put(`${AppConfig.serverURL}/api/speaker/new/`+this.state.userInfo._id, JSON.parse(JSON.stringify(user)))
        .then(response => {
          let userInfo = JSON.stringify(response.data);
          AsyncStorage.setItem("USER_DETAILS", userInfo);
          ToastAndroid.showWithGravity(
            'Your profile has been updated successfully..',
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
            
          );
          this.props.navigation.replace('MyProfile');
       
        })
        .catch(error => {
        // console.log("(error)", error.response);
    });
        }else{           
        axios
        .put(`${AppConfig.serverURL}/api/attendee/new/`+this.state.userInfo._id, JSON.parse(JSON.stringify(user)))
        .then(response => {
          let userInfo = JSON.stringify(response.data);
          AsyncStorage.setItem("USER_DETAILS", userInfo);
          ToastAndroid.showWithGravity(
            'Your profile has been updated successfully..',
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
            
          );
          this.props.navigation.replace('MyProfile');
        })
        .catch(error => {
         console.log("(error)", error.response);
    });
  }
}
}
validate=(fname,lname,contact)=>{
    var hasNumber = /\d/;

    if(fname.length>0 && !hasNumber.test(fname)){
        if(lname.length>0 && !hasNumber.test(lname)){
            if(contact.toString().length==10 && contact.toString().match(/^[0-9]+$/)){    
                   
                        return true;
            }else{
              this.setState({...this.state, contactError:'Please enter valid contact details',lnameError:'',fnameError:''});
                return false;
            }
        }else{
          this.setState({...this.state, contactError:'',lnameError:'Please enter valid last name',fnameError:''});
            return false;
        }
    }else{
      this.setState({...this.state, contactError:'',lnameError:'',fnameError:'Please enter valid first name'});
        return false;
    } 
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
    let avatar;

    if(!userInfo.facebookProfileURL){
      userInfo.facebookProfileURL="";
    }
    if(!userInfo.linkedinProfileURL){
      userInfo.linkedinProfileURL="";
    }
    if(!userInfo.twitterProfileURL){
      userInfo.twitterProfileURL="";
    }
    if (userInfo.profileImageURL) {
      avatar = <Image style={{ width: 100, height: 100,borderRadius:100}} source={{ uri: userInfo.profileImageURL }} />     

  } else {
      avatar = <Image style={{ width: 100, height: 100,borderRadius:100}} source={require('../../assets/images/defaultUserImg.png')} />
  } 
    return ( 
        <View style={{paddingTop:15}}>
        <View style={[styles.profileImageStyle]} >
                <TouchableOpacity key={userInfo.firstName} onPress={() => this._pickImage()}> 
                <View style={{borderColor:'#999999',borderWidth:2,borderRadius:100}}>
                {avatar}
               
                </View>
                  </TouchableOpacity>
                  </View>
                  <View style={[styles.column]}>

                   <RkText style={{color: '#000',fontSize : 15, textAlign: 'left'}}>First name</RkText>
                  <TextInput  underlineColorAndroid='transparent' style={[styles.text]}  value={userInfo.firstName} onChangeText={(text) => this.editInput('fname',text)} />
                  <Text style={[styles.errorStyle]} ref='contact'>{this.state.fnameError}</Text>

                  <RkText style={{color: '#000',fontSize : 15, textAlign: 'left'}}>Last name</RkText>
                  <TextInput underlineColorAndroid='transparent' style={[styles.text]}  value={userInfo.lastName} onChangeText={(text) => this.editInput('lname',text)} />
                  <Text style={[styles.errorStyle]} ref='contact'>{this.state.lnameError}</Text>

                  <RkText style={{color: '#000',fontSize : 15, textAlign: 'left'}}>Contact number</RkText>
                  <TextInput underlineColorAndroid='transparent' keyboardType='numeric'    style={[styles.text]}  value={''+userInfo.contact}  onChangeText={(text) => this.editInput('contact',text)} />
                  <Text style={[styles.errorStyle]} ref='contact'>{this.state.contactError}</Text>

                  <RkText style={{color: '#000',fontSize : 15, textAlign: 'left'}}>Linkedin profile</RkText>
                  <TextInput underlineColorAndroid='transparent' placeholder='Profile url' style={[styles.text]}   value={''+userInfo.linkedinProfileURL} onChangeText={(text) => this.editInput('linkedin',text)} />
                  
                  <RkText style={{color: '#000',fontSize : 15, textAlign: 'left'}}>Facebook profile</RkText>
                  <TextInput underlineColorAndroid='transparent'  placeholder='Profile url'  style={[styles.text]} value={''+userInfo.facebookProfileURL}  onChangeText={(text) => this.editInput('facebook',text)} />
                  
                  <RkText style={{color: '#000',fontSize : 15, textAlign: 'left'}}>Twitter profile</RkText>
                  <TextInput underlineColorAndroid='transparent'  placeholder='Profile url'  style={[styles.text]} value={''+userInfo.twitterProfileURL}  onChangeText={(text) => this.editInput('twitter',text)} />
                  
                  <GradientButton colors={['#f20505', '#f55050']} text='Save' style={{marginTop:5,width: Platform.OS === 'ios' ? 150 :170 , alignSelf : 'center',marginTop:10}}
                onPress={() => this.submit()}/>
                </View>
                </View>
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
    marginTop: 30
  },
 heading: {
      paddingBottom: 12.5
    },
  column: {
    borderColor: theme.colors.border.base,
    alignItems: "flex-start",
    paddingLeft:20,
    paddingRight:20

    },
    profileImageStyle: {
      borderColor: theme.colors.border.base,
      alignItems: "center"  
      },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    borderColor :'black'
  },
  text:{
    alignSelf: 'stretch',
    fontSize : 17,
    height:35,
    borderLeftColor: '#fff',
    borderTopColor: '#fff',
    borderRightColor: '#fff',
    borderBottomColor: '#808080',
    color:'#808080',
    borderWidth: 1,
    paddingLeft:7

    },
    errorStyle:{
      color:'#ff0000',
      fontStyle: 'italic',
      paddingLeft:8
    }
}));

