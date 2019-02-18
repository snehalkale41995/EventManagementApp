import React from "react";
import { RkText, RkStyleSheet } from "react-native-ui-kitten";
import { Container } from "native-base";
import {
  View,
  WebView,
  Text,
  NetInfo,
  Platform,
  ScrollView,
  Cont
} from "react-native";
import { scale, scaleModerate, scaleVertical } from "../../utils/scale";
import * as loginService from "../../serviceActions/login";
import QRCode from "react-native-qrcode";
import { Loader } from "../../components/loader";
import { Footer } from "../../components/footer";
import { GradientButton } from "../../components/gradientButton";
import * as eventService from "../../serviceActions/event";
import { Tab, TabHeading, Tabs } from "native-base";
import { BackHandler } from "react-native";
import * as infoService from "../../serviceActions/staticPages";


let fbPageURL =
  "https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FTiEGlobal1%2F&tabs=timeline&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
let twitterPageURL =
'<a class="twitter-timeline" href="https://twitter.com/TiEGlobal?ref_src=twsrc%5Etfw">Tweets by TiEGlobal</a> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>'
export class SocialFeed extends React.Component {
  static navigationOptions = {
    title: "Social feed".toUpperCase()
  };

  constructor(props) {
    super(props);
    this.state = {
      isOffline: false,
      eventInfo: {},
      isLoaded: false,
      facebookUrl: "",
      twitterUrl: ""
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
          this.getEventInfo();
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
    this.getEventInfo();
    NetInfo.addEventListener(
      "connectionChange",
      this.handleFirstConnectivityChange
    );
  }

  getEventInfo() {
    let eventInfo;
    eventService.getCurrentEvent(eventInfo => {
      if (eventInfo) {
        let eventId = eventInfo._id;
        infoService
          .getEventInfo(eventId)
          .then(response => {
            if (response.length === 0) {
              this.setState({
                isLoaded: true,
                facebookUrl: fbPageURL,
                twitterUrl: twitterPageURL
              });
            } else {
              eventInfo = response[0];
              this.setState({
                facebookUrl:
                  eventInfo.facebookUrl !== ""
                    ? eventInfo.facebookUrl
                    : fbPageURL,
                twitterUrl:
                  eventInfo.twitterUrl !== ""
                    ? eventInfo.twitterUrl
                    : twitterPageURL,
                isLoaded: true
              });
            }
          })
          .catch(error => {
            this.setState({
              isLoaded: true
            });
          });
      } else {
        return;
      }
    });
  }

  handleFirstConnectivityChange = connectionInfo => {
    if (connectionInfo.type != "none") {
      this.getEventInfo();
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
  render() {
    if (this.state.isLoaded) {
      return (
        <Container style={[styles.root]}>
          <Tabs
            tabBarUnderlineStyle={{ borderColor: "#00ffff" }}
            style={{ elevation: 3, width: 400 }}
            style={styles.tabContent}
            locked={true}
            onChangeTab={() => {}}
          >
            <Tab
              heading="Twitter"
              tabStyle={{ backgroundColor: "#f20505" }}
              activeTabStyle={{ backgroundColor: "#f20505" }}
              textStyle={{ fontSize: 15, color: "#fff" }}
              activeTextStyle={{
                fontSize: 15,
                color: "#fff",
                fontWeight: "bold"
              }}
            >
              <View
                style={{
                  flex: 1,
                  alignContent: "center",
                  justifyContent: "center",
                  padding: 10,
                  backgroundColor: "#d9d9d9"
                }}
              >
                <WebView
                  style={{ flex: 1 }}
                  originWhitelist={["*"]}
                  source={{
                    html: this.state.twitterUrl
                  }}
                />
              </View>
            </Tab>
            <Tab
              heading="Facebook"
              tabStyle={{ backgroundColor: "#f20505" }}
              activeTabStyle={{ backgroundColor: "#f20505" }}
              textStyle={{ fontSize: 15, color: "#fff" }}
              activeTextStyle={{
                fontSize: 15,
                color: "#fff",
                fontWeight: "bold"
              }}
            >
              <View
                style={{
                  flex: 1,
                  alignContent: "center",
                  justifyContent: "center",
                  padding: 10,
                  backgroundColor: "#d9d9d9"
                }}
              >
                <WebView
                  automaticallyAdjustContentInsets={false}
                  source={{
                    uri: this.state.facebookUrl
                  }}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  decelerationRate="normal"
                  startInLoadingState={true}
                  scalesPageToFit={true}
                />
              </View>
            </Tab>
          </Tabs>
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
    paddingLeft: 20,
    paddingRight: 20
  },
  profileImageStyle: {
    borderColor: theme.colors.border.base,
    alignItems: "center"
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    borderColor: "black"
  },
  text: {
    alignSelf: "stretch",
    fontSize: 17,
    height: 35,
    borderLeftColor: "#fff",
    borderTopColor: "#fff",
    borderRightColor: "#fff",
    borderBottomColor: "#333",

    borderWidth: 1,
    paddingLeft: 4
  },
  screen: {
    backgroundColor: theme.colors.screen.base
  },
  tabContent: {
    backgroundColor: "#FFFFFF"
  },
  textColor: {
    color: "#ed1b24",
    fontSize: 11
  },
  activeBorder: {
    borderColor: "#ed1b24"
  }
}));
