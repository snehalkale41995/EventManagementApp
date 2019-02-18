import React from "react";
import moment from "moment";
import { ScrollView, Platform, Image, NetInfo, Dimensions } from "react-native";
import { Text, View, Icon, Container, Label, Col } from "native-base";
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Keyboard,
  Alert,
  AsyncStorage,
  ActivityIndicator,
  ToastAndroid
} from "react-native";
import {
  RkComponent,
  RkTheme,
  RkStyleSheet,
  RkText,
  RkAvoidKeyboard,
  RkButton,
  RkCard,
  RkChoice,
  RkTextInput,
  RkChoiceGroup
} from "react-native-ui-kitten";
import { NavigationActions } from "react-navigation";
import ReactMoment from "react-moment";
import { LinearGradient } from "expo";
import { GradientButton } from "../../components/gradientButton";
import { Avatar } from "../../components";
import * as eventService from "../../serviceActions/event";
import { Loader } from "../../components/loader";
import { Footer } from "../../components/footer";
import MarqueeText from "react-native-marquee";
import { BackHandler } from 'react-native';
import ProgressCircle from 'react-native-progress-circle'
 
const { width: viewportWidth, height: viewportHeight } = Dimensions.get(
  "window"
);
export const sliderWidth = viewportWidth;
export const itemWidth = viewportWidth / 2;
export class Events extends RkComponent {
  static navigationOptions = {
    title: "EVENTS".toUpperCase(),
    headerStyle: {
      backgroundColor: "#ed1b24"
    },
    textAlign: "center",
    headerTintColor: "#fff"
  };
  constructor(props) {
    super(props);
   // console.log('navigation',props.navigation.state)

    this.state = {
      userData:{},
      Events: [],
      pastEvents: [],
      isLoaded: false,
      isOffline: false,
      progress:0,
      event:{},
      backCount:0
    };
    this.storeEventDetails = this.storeEventDetails.bind(this);
  }

  handleBackPress=()=>{
    if(this.state.backCount===0){
      setTimeout(this.cancelExit,2000);
      ToastAndroid.showWithGravity(
        'Press back again to exit....',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
      this.setState({backCount:1});

      return true; 

    }else{
      this.exitApp();
      return false;
    }

  } 

  exitApp=()=>{
    BackHandler.exitApp();
  }
  cancelExit=()=>{
    this.setState({backCount:0});
  }
  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

    if (Platform.OS !== "ios") {
      NetInfo.isConnected.fetch().then(isConnected => {
        if (isConnected) {
          this.getEventsList();
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
    AsyncStorage.getItem("USER_DETAILS")
    .then(userDetails => {
      var user = JSON.parse(userDetails);
      this.setState({ userData: user });
    })
    .catch(err => {
      if (errorFn) {
      //  console.warn("Errors");
      }
    });
    setTimeout(() => {
      this.getEventsList();      
    },1000);
    
    NetInfo.addEventListener(
      "connectionChange",
      this.handleFirstConnectivityChange
    );
  }

  handleFirstConnectivityChange = connectionInfo => {
    if (connectionInfo.type != "none") {
      this.getEventsList();
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
    BackHandler.removeEventListener('hardwareBackPress',this.handleBackPress);

    NetInfo.removeEventListener(
      "connectionChange",
      this.handleFirstConnectivityChange
    );
  }

  getEventsList() {
    let thisRef = this;
    let Events = [];
    let pastEvents = [];
    let user = { ...this.state.userData };
   // console.log("user state", this.state.userData);
    let today = new Date().setHours(0, 0, 0, 0);
    eventService.getEvents().then(
      function(response) {
        response.forEach(data => {
          let startDate = new Date(data["startDate"]).setHours(0, 0, 0, 0);
          let endDate = new Date(data["endDate"]).setHours(0, 0, 0, 0);
          if (today <= endDate) {
            Events.push(data);
          }
          if (today > startDate) {
            pastEvents.push(data);
          }
        });
        Events.forEach(event => {
          if (user.event === event._id) {
            event.Registered = true;
          } else {
            event.Registered = false;
          }
        });
        pastEvents.forEach(event => {
          if (user.event === event._id) {
            event.Registered = true;
          } else {
            event.Registered = false;
          }
        });
        //console.log("Event Response", Events);
        //console.log("User", user);
        
        thisRef.setState({
          Events: Events,
          pastEvents: pastEvents,
          isLoaded: true
        });
        //thisRef.displayEvents();
      },
      function(error) {
        //console.error("Failed!", error);
      }
    );
  }
 
  startLoading=()=>{

    if(this.state.progress===100){
      this.props.navigation.navigate("App");
    }else{
      let pr=this.state.progress;
      this.setState({progress:pr+5})
      setTimeout(this.startLoading,30)
    }
  }

  storeEventDetails(event) {
    if (event) {
      let eventInfo = JSON.stringify(event);
      AsyncStorage.setItem("EVENT_DETAILS", eventInfo);
      
      this.setState({event:{...event}})
     this.startLoading();
    } else {
      AsyncStorage.setItem("EVENT_DETAILS", {});
    }
  }

  // displayEvents = () => {
  //   return this.state.Events.map((event, index) => {
  //     let avatar;
  //     if (event.eventLogo) {
  //       avatar = (
  //         <Image
  //           style={{ width: 60, height: 60 }}
  //           source={{ uri: event.eventLogo }}
  //         />
  //       );
  //     } else {
  //       avatar = (
  //         <Image
  //           style={{ width: 60, height: 60 }}
  //           source={require("../../assets/images/defaultSponsorImg.png")}
  //         />
  //       );
  //     }
  //     return (
  //       <TouchableOpacity
  //         key={index}
  //         onPress={() => this.storeEventDetails(event)}
  //       >
  //         <RkCard rkType="shadowed" style={[styles.card]}>
  //           <View style={{ flexDirection: "row" }}>
  //             <View
  //               style={{
  //                 flexDirection: "column",
  //                 alignItems: "flex-start",
  //                 marginVertical: 10,
  //                 flex: 3,
  //                 alignSelf: "center",
  //                 marginLeft: 10
  //               }}
  //             >
  //               {avatar}
  //             </View>
  //             <View
  //               style={{
  //                 flexDirection: "column",
  //                 alignItems: "flex-start",
  //                 marginVertical: 10,
  //                 flex: 6,
  //                 marginLeft: -10
  //               }}
  //             >
  //               <View style={{ flexDirection: "row" }}>
  //                 <Text style={styles.headerText}>{event.eventName}</Text>
  //               </View>
  //               <View style={{ flexDirection: "row" }}>
  //                 <View
  //                   style={{
  //                     flexDirection: "column",
  //                     alignItems: "flex-start",
  //                     marginVertical: 10,
  //                     flex: 1
  //                   }}
  //                 >
  //                   <Icon style={[styles.iconStyle]} name="check-circle" />
  //                 </View>
  //                 <View
  //                   style={{
  //                     flexDirection: "column",
  //                     alignItems: "flex-start",
  //                     marginVertical: 10,
  //                     flex: 7
  //                   }}
  //                 >
  //                   <Text style={styles.infoText}>
  //                     {" "}
  //                     {moment(event.startDate).format("DD.MM.YYYY")} -{" "}
  //                     {moment(event.endDate).format("DD.MM.YYYY")}{" "}
  //                   </Text>
  //                 </View>
  //               </View>
  //               <View style={{ flexDirection: "row", marginTop: 0 }}>
  //                 <View
  //                   style={{
  //                     flexDirection: "column",
  //                     alignItems: "flex-start",
  //                     marginVertical: 0,
  //                     flex: 1
  //                   }}
  //                 >
  //                   <Icon style={[styles.iconStyle]} name="pin" />
  //                 </View>
  //                 <View
  //                   style={{
  //                     flexDirection: "column",
  //                     alignItems: "flex-start",
  //                     marginVertical: 0,
  //                     flex: 7
  //                   }}
  //                 >
  //                   <Text style={styles.infoText}>{event.venue}</Text>
  //                 </View>
  //               </View>
  //             </View>
  //           </View>
  //         </RkCard>
  //       </TouchableOpacity>
  //     );
  //   });
  // };
  _renderItem({ item, index }) {
    let { gradient } = this.defineStyles();
    let avatar;
    if (item.eventLogo) {
      avatar = (
        <Image
          style={{ width: 60, height: 60 }}
          source={{ uri: item.eventLogo }}
        />
      );
    } else {
      avatar = null;
    }
    if (index % 2 == 0) {
      return (
        <TouchableOpacity onPress={() => this.storeEventDetails(item)}>
          {/* <RkCard rkType="shadowed" style={[styles.evenCard]}> */}
          <LinearGradient
            colors={["#f20505", "#f55050"]}
            start={{ x: 0.0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={[styles.linearGradient]}
          >
            <View
              style={{
                flexDirection: "row",
                alignSelf: "flex-end",
                marginRight: 2
              }}
            >
              {item.Registered ? (
                <Text style={[styles.register]}>
                  {" "}
                  <Icon
                    style={[styles.iconStyle]}
                    name="ios-checkmark-circle"
                  />{" "}
                  Registered
                </Text>
              ) : null}
            </View>
            <View
              style={{
                flexDirection: "row",
                marginVertical: 5,
                alignSelf: "flex-start",
                alignItems: "center",
                marginTop: 20
              }}
            >
              <MarqueeText
                style={{
                  fontSize: 25,
                  color: "#FFFFFF",
                  fontWeight: "500",
                  alignItems: "center"
                }}
                duration={10000}
                marqueeOnStart
                loop
              >
                {item.eventName}
              </MarqueeText>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignSelf: "flex-start",
                marginLeft: 5,
                marginTop: 5
              }}
            >
              <Text style={[styles.infoText]}>
                {moment(item.startDate).format("DD.MM.YYYY")}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                flex: 2,
                alignSelf: "flex-start",
                marginLeft: 5,
                marginTop: 10
              }}
            >
              <Text style={[styles.infoText]}>{item.venue}</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignSelf: "flex-end",
                alignItems: "baseline",
                marginLeft: 5,
                marginTop: 5,
                marginBottom: 0
              }}
            >
              {avatar}
            </View>
          </LinearGradient>
          {/* </RkCard> */}
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity onPress={() => this.storeEventDetails(item)}>
          {/* <RkCard rkType="shadowed" style={[styles.oddCard]}> */}
          <LinearGradient
            colors={["#666666", "#9E9E9E"]}
            start={{ x: 0.0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={[styles.linearGradient]}
          >
            <View
              style={{
                flexDirection: "row",
                alignSelf: "flex-end",
                marginRight: 2
              }}
            >
              {item.Registered ? (
                <Text style={[styles.register]}>
                  <Icon
                    style={[styles.iconStyle]}
                    name="ios-checkmark-circle"
                  />{" "}
                  Registered
                </Text>
              ) : null}
            </View>
            <View
              style={{
                flexDirection: "row",
                marginVertical: 5,
                alignSelf: "flex-start",
                marginLeft: 3,
                alignItems: "center",
                marginTop: 20
              }}
            >
              <MarqueeText
                style={{
                  fontSize: 25,
                  fontWeight: "400",
                  color: "#FFFFFF",
                  alignItems: "center",
                  fontWeight: "500"
                }}
                duration={10000}
                marqueeOnStart
                loop
              >
                {item.eventName}
              </MarqueeText>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignSelf: "flex-start",
                marginLeft: 5,
                marginTop: 5
              }}
            >
              <Text style={[styles.infoText]}>
                {moment(item.startDate).format("DD.MM.YYYY")}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                flex: 2,
                alignSelf: "flex-start",
                marginLeft: 5,
                marginTop: 10
              }}
            >
              <Text style={[styles.infoText]}>{item.venue}</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignSelf: "flex-end",
                alignItems: "baseline",
                marginLeft: 5,
                marginTop: 10,
                marginBottom: 0
              }}
            >
              {avatar}
            </View>
          </LinearGradient>
          {/* </RkCard> */}
        </TouchableOpacity>
      );
    }
  }
  render() {
    //let eventList = this.displayEvents(); C:\Users\ismail.saiyyed\Documents\Tiecon\Merged\EventManagementApp\app\assets\images\logo.png
    if (this.state.isLoaded) {
      return (
        <Container style={[styles.root]}>

          {this.state.progress>0?<View style={{flex:1, justifyContent: 'center',alignItems:'center',opacity:80,backgroundColor:'#fff'}}><ProgressCircle percent={this.state.progress} radius={120} borderWidth={10} color="#00ff00" shadowColor="#cccccc"  >
          <LinearGradient
            colors={["#d4145a", "#fbba50"]}
            start={{ x: 0.0, y: 0.5 }} 
            end={{ x: 1, y: 0.5 }}
            style={[styles.linearGradient]}
            style={{borderRadius:100,width:250,height:250,justifyContent: 'center',alignItems:'center'}}
          >
          <Text style={{color:'#fff',fontSize:15,fontWeight:'bold'}}>{this.state.event.eventName}</Text>
          <Text style={{color:'#fff',fontSize:15,fontWeight:'bold'}}>{this.state.event.venue}</Text>
          {/* <Text style={{color:'#fff',fontSize:12,fontWeight:'bold'}}>{this.state.event.startDate}</Text> */}
          {/* <Image
            source={require('../../assets/images/logo.png')}/>  */}
          </LinearGradient></ProgressCircle></View>:  <ScrollView>

<View>
  <View style={[styles.headerView]}>
    <Text style={[styles.headers]}>Upcoming Events</Text>
  </View>
  <FlatList
    horizontal={true}
    data={this.state.Events}
    renderItem={(item, index) => this._renderItem(item, index)}
    showsHorizontalScrollIndicator={false}
  />
</View>
<View>
  <View style={[styles.headerView]}>
    <Text style={[styles.headers]}>Past Events</Text>
  </View>
  <FlatList
    horizontal={true}
    data={this.state.pastEvents}
    renderItem={(item, index) => this._renderItem(item, index)}
    showsHorizontalScrollIndicator={false}
  />
</View>
</ScrollView> }

         
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
    backgroundColor: theme.colors.screen.base
  },
  headerView: {
    padding: 5,
    margin: 5
  },
  headers: {
    fontSize: 15,
    fontWeight: "100",
    color: "#808080"
  },
  register: {
    fontSize: 13,
    fontWeight: "100",
    color: "#E7E9E7"
  },
  evenCard: {
    margin: 5,
    borderWidth: 1,
    padding: 10,
    height: itemWidth * 1.25,
    width: itemWidth * 1.25,
    borderRadius: 10
    //backgroundColor: "#A4A4A8"
  },
  oddCard: {
    margin: 5,
    borderWidth: 2,
    padding: 10,
    height: itemWidth * 1.25,
    width: itemWidth * 1.25,
    borderRadius: 10,
    backgroundColor: "#FF5C5C"
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 16
  },
  infoText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#E7E9E7"
  },
  iconStyle: {
    color: "#2DEB33",
    fontSize: 15,
    marginRight: 2
  },
  viewContainer: {
    backgroundColor: "#ffffff",
    flex: 1,
    alignItems: "left"
  },
  qaContainer: {
    minHeight: viewportHeight * 3 / 4
  },
  contentContainer: {
    alignItems: "left",
    minHeight: viewportHeight * 3 / 4 + 30
  },
  slide: {
    flexDirection: "column",
    width: itemWidth
  },
  linearGradient: {
    padding: 10,
    margin: 10,
    borderRadius: 5,
    height: itemWidth * 1.25,
    width: itemWidth * 1.25
  }
}));
