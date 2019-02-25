import React from 'react';
import { View, Image, Alert, Keyboard, ActivityIndicator, AsyncStorage, Platform, Text} from 'react-native';
import { RkButton, RkText, RkTextInput, RkAvoidKeyboard, RkStyleSheet } from 'react-native-ui-kitten';
import {FontAwesome} from '../../assets/icons';
import {GradientButton} from '../../components/gradientButton';
import {RkTheme} from 'react-native-ui-kitten';
import {scale, scaleModerate, scaleVertical} from '../../utils/scale';
import * as loginService from '../../serviceActions/login';


function renderIf(condition, content) {
  if (condition) {
      return content;
  } else {
      return null;
  }
}
export class LoginV2 extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      isLoading: false,
    };
  }

  _onAuthenticate() {
     let navigation = this.props.navigation;
    let user = {
      email : this.state.email,
      password : this.state.password
    }
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!this.state.email || !re.test(this.state.email)) {
      Alert.alert(
        'Invalid Email',
        'Please enter valid email.',
        [
          { text: 'Ok', onPress: () => {}},
        ],
        { cancelable: false }
      );
      return;
    }

    if (!this.state.password || this.state.password.toString().trim().length < 6 ) {
      Alert.alert(
        'Invalid Password',
        '',
        [
          { text: 'Ok', onPress: () => {}},
        ],
        { cancelable: false }
      );
      return;
    }
    
   this.setState({isLoading: true});
   loginService.loginUser(user)
   .then(response => {
    let userInfo = JSON.stringify(response);
    AsyncStorage.setItem("USER_DETAILS", userInfo);
     Alert.alert(
        'Login Successful',
        'Welcome' +' '+ response.firstName +'',
        [
          { text: 'Ok', onPress: () => {}},
        ],
        { cancelable: false }
      );
    navigation.navigate('Event');
   }).catch((error)=>{
      this.setState({isLoading: false});
      let errorMessage = error;
      Alert.alert(
        'Error',
        errorMessage,
        [
          { text: 'Cancel', onPress: () => {}},
        ],
        {cancelable: false}
      );
   })
  }

  render() {
    let renderIcon = () => {
      if (RkTheme.current.name === 'light')
        return <Image style={styles.image} source={require('../../assets/images/logo.png')}/>;
      return <Image style={styles.image} source={require('../../assets/images/logo.png')}/>
    };

    return (
      <RkAvoidKeyboard
        style={styles.screen}
        onStartShouldSetResponder={ (e) => true}
        onResponderRelease={ (e) => Keyboard.dismiss()}>
        <View style={[styles.header, styles.loginHeader]}>
          {renderIcon()}
          {/* <RkText rkType='light h1'>Tie</RkText>
          <RkText rkType='logo h0'>Pune</RkText> */}
          <View style={{marginTop : 20}}>
            
            <Text style={{fontSize : 30 ,fontStyle:'italic', fontFamily: 'Roboto-Bold'}}>TIECON</Text> 
          </View>
        </View>
        <View style={styles.content}>
          <View>
            <RkTextInput rkType='rounded' onChangeText={(text) => this.setState({email: text})} placeholder='Username' style={styles.loginInput}/>
            <RkTextInput rkType='rounded' onChangeText={(text) => this.setState({password: text})} placeholder='Password' secureTextEntry={true} style={styles.loginInput}/>
            <GradientButton colors={['#E7060E', '#f55050']} style={styles.save} rkType='large' text='LOGIN' onPress={ this._onAuthenticate.bind(this) } />
          </View>
          <View style={styles.footer}>
            <View style={styles.textRow}>
              <RkText rkType='primary3'>Powered by:</RkText>
              {/* <RkButton rkType='clear' onPress={() => this.props.navigation.navigate('SignUp')}>
                <RkText rkType='header6'> Sign up now </RkText>
              </RkButton> */}
            </View>
          </View>
          <View style={styles.buttons}>
            <RkButton style={styles.button} rkType='sponsors' style={{marginTop: 5}}>
              <Image style={styles.eternusLogo} source={require('../../assets/images/eternusLogoMain.png')}/>;
            </RkButton>
          </View>
        </View>
        {renderIf(this.state.isLoading, 
            <View style={styles.loading}> 
              <ActivityIndicator size='large' /> 
            </View>
        )}
      </RkAvoidKeyboard>
    )
  }
}

let styles = RkStyleSheet.create(theme => ({
  screen: {
    padding: scaleVertical(16),
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: theme.colors.screen.base
  },
  image: {
    marginTop:5
    //height: scaleVertical(77),
    //resizeMode: 'contain'
  },
  header: {
    paddingBottom: scaleVertical(10),
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  content: {
    justifyContent: 'space-between',
    marginTop : Platform.OS === "ios" ? 35 : 0
  },
  save: {
    marginVertical: 20,
    borderRadius:0,
    backgroundColor: '#ed1b24'
  },
  buttons: {
    flexDirection: 'row',
    marginBottom: scaleVertical(24),
    marginHorizontal: 24,
    justifyContent: 'space-around',
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  button: {
    borderColor: theme.colors.border.solid
  },
  footer: {},
  loading: {
    position: 'absolute',
    left: 0,
    backgroundColor: 'black',
    opacity: 0.5,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  loginInput:{
    borderRadius:0,
    borderWidth: 1,
    fontSize:13,
    padding: 5,
  },
  loginHeader:{
    marginBottom: 20,
  },
  eternusLogo:{
   // width: 150,
    //height:25

    height: scaleVertical(25),
    resizeMode: 'contain'
  }
}));