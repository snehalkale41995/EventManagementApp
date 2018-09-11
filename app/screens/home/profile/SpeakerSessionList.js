import React from "react";
import {
  FlatList,
  SectionList,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import { Text, View } from "native-base";
import {
  RkText,
  RkComponent,
  RkTextInput,
  RkAvoidKeyboard,
  RkTheme,
  RkStyleSheet
} from "react-native-ui-kitten";
import { data } from "../../../data";
import { Avatar } from "../../../components";
import { FontAwesome } from "../../../assets/icons";
import { GradientButton } from "../../../components";
import ScheduleTile from "../schedule/Schedule-tile";
import * as sessionService from "../../../serviceActions/session";
import firebase from "../../../config/firebase";
import { Service } from "../../../services";
var firestoreDB = firebase.firestore();

const TABLE = "Sessions";
export class SpeakerSessionList extends RkComponent {
  static navigationOptions = {
    title: "speaker".toUpperCase()
  };

  constructor(props) {
    super(props);
     this.state = {
      sessionList: []
    };
  }

  componentDidMount() {
    this.fetchSessionList();
  }

  fetchSessionList() {
    let { params } = this.props.navigation.state;
    let speakerId = params.speakersId;
    let eventId = params.eventId;
    let sessions = [];
    sessionService
      .getSessionsByEvent(eventId)
      .then(responseData => {
        if (responseData !== undefined && responseData.length !== 0) {
          responseData.forEach(session => {
            session.speakers.forEach(speaker => {
              if (speaker._id === speakerId) {
                sessions.push({
                  key: session._id,
                  sessionName : session.sessionName,
                  event : session.event,
                  speakers: session.speakers,
                  volunteers: session.volunteers,
                  room : session.room,
                  description : session.description, 
                  sessionType : session.sessionType,
                  sessionCapacity : session.sessionCapacity,
                  startTime : session.startTime,
                  endTime : session.endTime,
                  isBreak: !!session.isBreak,
                  isRegistrationRequired: !!session.isRegistrationRequired
                });
              }
            });
          });
        this.setState({sessionList:sessions})
        }
      })
      .catch(() => {
        //console.warn(error);
      });
  }

  render() {
    let sessionsList;
    if (this.state.sessionList && this.state.sessionList.length > 0) {
      sessionList = (
        <FlatList
          data={this.state.sessionList}
          keyExtractor={(item, index) => index}
          renderItem={({ item, index }) => (
            <ScheduleTile navigation={this.props.navigation} session={item} />
          )}
        />
      );
    } else if (this.state.sessionList && this.state.sessionList.length == 0) {
      sessionList = (
        <View style={styles.loading}>
          <Text>No Sessions found...</Text>
        </View>
      );
    } else {
      sessionList = (
        <View style={styles.loading}>
          <ActivityIndicator size="large" />
        </View>
      );
    }
    return <View style={styles.listContainer}>{sessionList}</View>;
  }
}

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    flexDirection: "column"
  },
  loading: {
    marginTop: 250,
    left: 0,
    opacity: 0.5,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center"
  }
});
