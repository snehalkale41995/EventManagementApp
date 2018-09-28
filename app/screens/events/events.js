import React from 'react';
import moment from 'moment';
import { ScrollView, Platform, Image, NetInfo } from 'react-native';
import { Text, View, Icon, Container, Label ,Button} from 'native-base';
import { StyleSheet, FlatList, TouchableOpacity, Keyboard, Alert, AsyncStorage, ActivityIndicator, BackHandler } from 'react-native';
import { RkComponent, RkTheme, RkStyleSheet, RkText, RkAvoidKeyboard, RkButton, RkCard, RkChoice, RkTextInput, RkChoiceGroup } from 'react-native-ui-kitten';
import { NavigationActions } from 'react-navigation';
import ReactMoment from 'react-moment';
import { GradientButton } from '../../components/gradientButton';
import { Avatar } from '../../components';
import * as eventService from '../../serviceActions/event';
import {Loader} from '../../components/loader';
import {Footer} from '../../components/footer';
import {exitAlert} from '../../components/backHandler';       

export class Events extends RkComponent {
  static navigationOptions = ({ navigation }) => ({
    title: "UPCOMING EVENTS".toUpperCase(),
    headerStyle: {
      backgroundColor: "#ed1b24"
    },
    headerLeft: (
      <Icon
        name="ios-arrow-round-back-outline"
        onPress={() => {exitAlert()}}
         size={50}
         marginLeft={10}
         color="white"
      />
    ),
    textAlign: "center",
    headerTintColor: "#fff"
  });

  constructor(props) {
    super(props);
    this.state = {
      Events: [],
      isLoaded: false,
      isOffline: false
    };
  }

  componentWillMount() {
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
    this.getEventsList();
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

  getEventsList() {
    let thisRef = this;
    let Events = [];
    let today = new Date().setHours(0, 0, 0, 0);
    eventService.getEvents().then(
      function(response) {
        response.forEach(data => {
          let endDate = new Date(data["endDate"]).setHours(0, 0, 0, 0);
          if (today <= endDate) {
            Events.push(data);
          }
        });
        thisRef.setState({
          Events: Events,
          isLoaded: true
        });
        thisRef.displayEvents();
      },
      function(error) {
        console.error("Failed!", error);
      }
    );
  }

  storeEventDetails(event) {
    if (event) {
      let eventInfo = JSON.stringify(event);
      AsyncStorage.setItem("EVENT_DETAILS", eventInfo);
      this.props.navigation.navigate("EventDetails");
    } else {
      AsyncStorage.setItem("EVENT_DETAILS", {});
    }
  }

  displayEvents = () => {
    return this.state.Events.map((event, index) => {
      let avatar;
      if (event.eventLogo) {
        avatar = (
          <Image
            style={{ width: 60, height: 60 }}
            source={{ uri: event.eventLogo }}
          />
        );
      } else {
        avatar = (
          <Image
            style={{ width: 60, height: 60 }}
            source={require("../../assets/images/defaultSponsorImg.png")}
          />
        );
      }
      return (
        <TouchableOpacity
          key={index}
          onPress={() => this.storeEventDetails(event)}
        >
          <RkCard rkType="shadowed" style={[styles.card]}>
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "flex-start",
                  marginVertical: 10,
                  flex: 3,
                  alignSelf: "center",
                  marginLeft: 10
                }}
              >
                {avatar}
              </View>
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "flex-start",
                  marginVertical: 10,
                  flex: 6,
                  marginLeft: -10
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.headerText}>{event.eventName}</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <View
                    style={{
                      flexDirection: "column",
                      alignItems: "flex-start",
                      marginVertical: 10,
                      flex: 1
                    }}
                  >
                    <Icon style={[styles.iconStyle]} name="calendar" />
                  </View>
                  <View
                    style={{
                      flexDirection: "column",
                      alignItems: "flex-start",
                      marginVertical: 10,
                      flex: 7
                    }}
                  >
                    <Text style={styles.infoText}>
                      {" "}
                      {moment(event.startDate).format("DD.MM.YYYY")} -{" "}
                      {moment(event.endDate).format("DD.MM.YYYY")}{" "}
                    </Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row", marginTop: 0 }}>
                  <View
                    style={{
                      flexDirection: "column",
                      alignItems: "flex-start",
                      marginVertical: 0,
                      flex: 1
                    }}
                  >
                    <Icon style={[styles.iconStyle]} name="pin" />
                  </View>
                  <View
                    style={{
                      flexDirection: "column",
                      alignItems: "flex-start",
                      marginVertical: 0,
                      flex: 7
                    }}
                  >
                    <Text style={styles.infoText}>{event.venue}</Text>
                  </View>
                </View>
              </View>
            </View>
          </RkCard>
        </TouchableOpacity>
      );
    });
  };

  render() {
    let eventList = this.displayEvents();
    if (this.state.isLoaded) {
      return (
        <Container style={[styles.root]}>
          <ScrollView>
            <View>{eventList}</View>
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
        backgroundColor: theme.colors.screen.base
    },
    card: {
        margin: 1,
        padding: 4
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 16
    },
    infoText: {
        fontSize: 12
    },
    iconStyle : {
    color: '#ed1b24',
    fontSize: 15
  },
}));