import React from 'react';
import { RkText, RkStyleSheet } from 'react-native-ui-kitten';
import { Container } from 'native-base';
import { Image, ImageBackground,TextInput,ScrollView, View, StyleSheet, Alert, AsyncStorage, ActivityIndicator, Text, Linking, TouchableOpacity,Platform,NetInfo ,TouchableHighlight,ToastAndroid } from 'react-native';
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
      emailError:'',
      fbError:'',
      lnError:'',
      trError:'',
      imageFile:null
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
      const uriParts = result.uri.split('.');
      const fileType = uriParts[uriParts.length - 1];
      let image={
        uri:result.uri,
        type:'image/jpeg',
        name:this.state.userInfo.email
      };
      // image.name="profile";
      // image.type= `image/${fileType}`;
      // image.uri=result.uri;
      this.setState({imageFile:image});
      console.warn(this.state.imageFile)
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
    console.warn(user)

    delete user._id;
    delete user.__v; 

    let data = new FormData();
    for (var key in user) {
      if (key != "profileImageURL") data.append(key, user[key]);
    }
    if(this.state.imageFile){
      data.append("profileImageURL", this.state.imageFile);
    }else{
      data.append("profileImageURL", user['profileImageURL']);
    }
    if(this.validate(user.firstName,user.lastName,user.contact.toString(),user.facebookProfileURL,user.linkedinProfileURL,user.twitterProfileURL)){
        if(user.roleName==='Speaker'){
          console.warn('Inside speaker call',data)
          axios
        .put(`${AppConfig.serverURL}/api/speaker/new/`+this.state.userInfo._id,data)
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
    });
        }else{ 
        axios
        .put(`${AppConfig.serverURL}/api/attendee/new/`+this.state.userInfo._id, data)
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
    });
  }
}
}
validate=(fname,lname,contact,fb,ln,tr)=>{
  var hasNumber = /\d/;
  var pattern = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
    if(fname.length>0 && !hasNumber.test(fname)){
        if(lname.length>0 && !hasNumber.test(lname)){
            if(contact.toString().length==10 && contact.toString().match(/^[0-9]+$/)){    
                  if(pattern.test(ln) || ln===""){
                    if(pattern.test(fb)|| fb===""){
                      if(pattern.test(tr)|| tr===""){
                        return true;
                      }else{
                        this.setState({...this.state,fbError:'',lnError:'', trError:'Please enter valid profile URL',lnameError:'',fnameError:''});
                        return false;
                      }
                    }else{
                      this.setState({...this.state,lnError:'',trError:'', fbError:'Please enter valid profile URL',lnameError:'',fnameError:''});
                      return false;
                    }
                  }else{
                    this.setState({...this.state, fbError:'',trError:'',lnError:'Please enter valid profile URL',lnameError:'',fnameError:''});
                    return false;
                  }
            }else{
              this.setState({...this.state,fbError:'',lnError:'',trError:'', contactError:'Please enter valid contact details',lnameError:'',fnameError:''});
                return false;
            }
        }else{
          this.setState({...this.state, contactError:'',fbError:'',lnError:'',trError:'',lnameError:'Please enter valid last name',fnameError:''});
            return false;
        }
    }else{
      this.setState({...this.state, contactError:'',lnameError:'',fbError:'',lnError:'',trError:'',fnameError:'Please enter valid first name'});
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
      avatar = <ImageBackground imageStyle={{borderRadius:50}} style={{ width: 100, height: 100}} source={{ uri: userInfo.profileImageURL }} ><View style={{paddingLeft:75,paddingTop:70}}><Image style={{ width: 25, height: 25}} source={require('../../assets/images/edit.png')}></Image></View></ImageBackground>

  } else {
      avatar = <ImageBackground imageStyle={{borderRadius:50}} style={{ width: 100, height: 100}} source={require('../../assets/images/defaultUserImg.png')} />
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
                  <Text style={[styles.errorStyle]} ref='contact'>{this.state.lnError}</Text>

                  <RkText style={{color: '#000',fontSize : 15, textAlign: 'left', marginTop :7}}>Facebook profile</RkText>
                  <TextInput underlineColorAndroid='transparent'  placeholder='Profile url'  style={[styles.text]} value={''+userInfo.facebookProfileURL}  onChangeText={(text) => this.editInput('facebook',text)} />
                  <Text style={[styles.errorStyle]} ref='contact'>{this.state.fbError}</Text>

                  <RkText style={{color: '#000',fontSize : 15, textAlign: 'left', marginTop :7}}>Twitter profile</RkText>
                  <TextInput underlineColorAndroid='transparent'  placeholder='Profile url'  style={[styles.text]} value={''+userInfo.twitterProfileURL}  onChangeText={(text) => this.editInput('twitter',text)} />
                  <Text style={[styles.errorStyle]} ref='contact'>{this.state.trError}</Text>

             {/* <View style={{ width: Platform.OS === 'ios' ? 300 : 360  ,alignItems:'center', marginTop : 5, marginBottom : 5}} >
             <GradientButton colors={['#f20505', '#f55050']} text='Save' style={{width: Platform.OS === 'ios' ? 130 :150 , alignSelf : 'center', marginRight:10}}
              onPress={() => this.submit()}/>
             </View>  */}
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
               <View style={{width: Platform.OS === 'ios' ? 360 : 360, alignItems:'center', marginTop : 5, marginBottom : 5}}>
                   <GradientButton colors={['#f20505', '#f55050']} text='Save' style={{marginTop:5,width: Platform.OS === 'ios' ? 150 :170 , alignSelf : 'center',marginTop:10, marginBotton:5}}
                   onPress={() => this.submit()}/> 
              </View>    
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

