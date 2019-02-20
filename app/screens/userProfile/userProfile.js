import React from "react";
import { RkText, RkStyleSheet } from "react-native-ui-kitten";
import { Container } from "native-base";
import {
  Image,
  ScrollView,
  View,
  StyleSheet,
  Alert,
  AsyncStorage,
  ActivityIndicator,
  Text,
  Linking,
  TouchableOpacity,
  Platform,
  NetInfo,
  ImageBackground
} from "react-native";
import { scale, scaleModerate, scaleVertical } from "../../utils/scale";
import * as loginService from "../../serviceActions/login";
import QRCode from "react-native-qrcode";
import { Loader } from "../../components/loader";
import { Footer } from "../../components/footer";
import { GradientButton } from "../../components/gradientButton";
import { BackHandler } from "react-native";

function renderIf(condition, content) {
  if (condition) {
    return content;
  } else {
    return null;
  }
}
export class UserProfile extends React.Component {
  static navigationOptions = {
    title: "Profile".toUpperCase()
  };

  constructor(props) {
    super(props);
    this.state = {
      isOffline: false,
      userInfo: {},
      isLoaded: false
    };
  }
  handleBackPress = () => {
    this.props.navigation.replace("HomeMenu");
    return true;
  };
  componentWillMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);

    if (Platform.OS !== "ios") {
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
      "connectionChange",
      this.handleFirstConnectivityChange
    );
  }

  handleFirstConnectivityChange = connectionInfo => {
    if (connectionInfo.type != "none") {
      this.getUserInfo();
    } else {
      this.setState({
        isOffline: true
      });
    }
    this.setState({
      isOffline: connectionInfo.type === "none"
    });
  };

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress);

    NetInfo.removeEventListener(
      "connectionChange",
      this.handleFirstConnectivityChange
    );
  }
  displayWebsite(websiteURL) {
    if (websiteURL) {
      Linking.openURL(websiteURL);
    } else return;
  }
  getUserInfo() {
    loginService.getCurrentUser(userInfo => {
      if (userInfo) {
        this.setState({
          userInfo: userInfo,
          isLoaded: true
        });
      } else {
        this.setState({ isLoaded: false });
      }
    });
  }

  displayInformation = () => {
    let userInfo = this.state.userInfo;
    let attendeeCode = userInfo.attendeeLabel + "-" + userInfo.attendeeCount;
    let attendeeId = userInfo._id;
    let userName = userInfo.firstName + "" + userInfo.lastName;

    let qrText = "TIE" + ":" + attendeeCode + ":" + attendeeId + ":" + userName;
    let avatar;
    if (userInfo.profileImageURL) {
      avatar = (
        <Image
          style={{
            width: 110,
            height: 110,
            borderColor: "#00ffff",
            borderWidth: 2,
            borderRadius: 100
          }}
          source={{ uri: userInfo.profileImageURL }}
        />
      );
    } else {
      avatar = (
        <Image
          style={{
            width: 110,
            height: 110,
            borderColor: "#00ffff",
            borderWidth: 2,
            borderRadius: 100
          }}
          source={require("../../assets/images/defaultUserImg.png")}
        />
      );
    }
    return (
        <View style={styles.root}>
              {/* <View style={styles.section}> */}
              <ImageBackground
              source={require('../../assets/images/profileBack.png')}
              imageStyle=''
              style={{width:'100%',height:200}}
    >
                <View style={{elevation:5}}>
                <View  style={[styles.column, styles.heading]}>
                  {/* <Image style={{ width: 120, height: 120,borderRadius:100 ,borderColor:'#f20505',borderWidth:1}} source={{ uri: userInfo.profileImageURL }} /> */}
                  {avatar}
                  <RkText style={{color: '#fff',fontSize : 25, textAlign: 'center'}}>{userInfo.firstName + " " + userInfo.lastName}</RkText>
                  <RkText style={{fontSize : 18,color: '#fff', textAlign: 'center'}}>{userInfo.roleName}</RkText> 
                </View>
                </View>
                </ImageBackground>
                <View style={[styles.column]}>
                  <RkText style={{color: '#E7060E', fontSize : 18, textAlign: 'center'}}>Contact Details</RkText>
                  <RkText style={{fontSize : 18, textAlign: 'center'}}>{userInfo.contact}</RkText>
                  <RkText style={{fontSize : 18, textAlign: 'center'}}>{userInfo.email}</RkText>
                </View> 
                <View  style={[styles.column]}>
                  <RkText style={{color: '#E7060E', fontSize : 18, textAlign: 'center'}}>Other Details</RkText>
                  <RkText style={{fontSize : 18, textAlign: 'center'}}>{userInfo.briefInfo}</RkText>
               
              </View> 
              <View  style={[styles.column]}>
              <RkText style={{color: '#E7060E', fontSize : 18, textAlign: 'center'}}>Social Media</RkText>
              <View style={{flexDirection:'row', marginTop:5}}>
              {userInfo.linkedinProfileURL ? (
              <TouchableOpacity
                onPress={() =>
                  this.displayWebsite(userInfo.linkedinProfileURL)}
              >
                <Image
                  style={[styles.sociallogo]}
                  source={require("../../assets/images/linkedin.png")}
                />
              </TouchableOpacity>
            ) : <Image
            style={[styles.sociallogo]}
            source={require("../../assets/images/linkedinDisabled.png")}
          />}
               {userInfo.facebookProfileURL ? (
              <TouchableOpacity
                onPress={() =>
                  this.displayWebsite(userInfo.facebookProfileURL)}
              >
                <Image
                  style={[styles.sociallogo]}
                  source={require("../../assets/images/fb.png")}
                />
              </TouchableOpacity>
            ) : <Image
            style={[styles.sociallogo]}
            source={require("../../assets/images/fbDisabled.png")}
          />}
               {userInfo.twitterProfileURL ? (
              <TouchableOpacity
                onPress={() =>
                  this.displayWebsite(userInfo.twitterProfileURL)}
              >
                <Image
                  style={[styles.sociallogo]}
                  source={require("../../assets/images/twitter.png")}
                />
              </TouchableOpacity>
            ) : <Image
            style={[styles.sociallogo]}
            source={require("../../assets/images/twitterDisabled.png")}
          />}            
              </View>
              </View>
              <View style={{ width: Platform.OS === 'ios' ? 320 : 380  ,alignItems:'center', marginTop : 5}} >
             <GradientButton colors={['#f20505', '#f55050']} text='Edit' style={{width: Platform.OS === 'ios' ? 150 :170 , alignSelf : 'center'}}
              onPress={() => this.props.navigation.replace('EditProfile', { sessionDetails: this.state.userInfo })}/>
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
            <View>{Info}</View>
          </ScrollView>
          <View>
            <Footer isOffline={this.state.isOffline} />
          </View>
        </Container>
      );
    } else {
      return (
        <Container style={[styles.root]}>
          <Loader />
          <View>
            <Footer isOffline={this.state.isOffline} />
          </View>
        </Container>
      );
    }
  }
}

let styles = RkStyleSheet.create(theme => ({
  root: {
    backgroundColor: "#f2f2f2",
    flex: 1
  },
  section: {
    backgroundColor: theme.colors.screen.base,
    marginTop: 35
  },
  heading: {
    paddingBottom: 12.5
  },
  column: {
    flexDirection: "column",
    borderColor: theme.colors.border.base,
    alignItems: "center",
    marginTop: 15
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    borderColor: "black"
  },
  sociallogo:{
    width: 50,
    height: 50,
    borderRadius: 100,
    padding:8
  }
}));
