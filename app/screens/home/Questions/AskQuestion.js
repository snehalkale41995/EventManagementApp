import React from "react";
import { View, Icon, Tab, TabHeading, Tabs, Container } from "native-base";
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Keyboard,
  NetInfo,
  Platform,
  Alert,
  AsyncStorage,
  ScrollView,
  Text,
  Image,
  ActivityIndicator
} from "react-native";
import {
  RkComponent,
  RkTheme,
  RkText,
  RkAvoidKeyboard,
  RkStyleSheet,
  RkButton,
  RkCard,
  RkTextInput
} from "react-native-ui-kitten";
import { NavigationActions } from "react-navigation";
import ReactMoment from "react-moment";
import Moment from "moment";
import { Avatar } from "../../../components";
import { GradientButton } from "../../../components/gradientButton";
import styleConstructor, { getStatusStyle } from "../schedule/styles.js";
import * as questionFormService from "../../../serviceActions/questionForm";
import * as eventService from "../../../serviceActions/event";
import * as loginService from "../../../serviceActions/login";

export default class AskQuestion extends RkComponent {
  constructor(props) {
    super(props);
    this.styles = styleConstructor();
    this.sessionDetails = this.props.navigation.state.params.sessionDetails;
    this.state = {
      Question: "",
      sessionDetails: this.sessionDetails,
      User: {},
      sessionId: this.sessionDetails.key,
      topQueView: false,
      recentQueView: true,
      questionData: [],
      orderBy: "timestamp",
      userId: "",
      eventId: "",
      queAccess: "none",
      questionStatus: false,
      AskQFlag: true,
      isLoaded: false,
      componentLoaded: true
    };
  }

  componentWillMount() {
    if (Platform.OS !== "ios") {
      NetInfo.isConnected.fetch().then(isConnected => {
        if (isConnected) {
          this.getCurrentUser();
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
    this.getCurrentUser();
    NetInfo.addEventListener(
      "connectionChange",
      this.handleFirstConnectivityChange
    );
  }

  handleFirstConnectivityChange = connectionInfo => {
    if (connectionInfo.type != "none") {
      this.getCurrentUser();
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
    NetInfo.removeEventListener(
      "connectionChange",
      this.handleFirstConnectivityChange
    );
  }

  getCurrentUser() {
    let compRef = this;
    loginService.getCurrentUser(userDetails => {
      eventService.getCurrentEvent(eventDetails => {
        this.setState({
          User: userDetails,
          userId: userDetails._id,
          eventId: eventDetails._id
        });
      });
      compRef.checkSessionTime();
    });
  }

  checkSessionTime = () => {
    let thisRef = this;
    let session = this.state.sessionDetails;
    let today = Moment(new Date()).format();
    let sessionStart = Moment(session.startTime).format();
    let sessionEnd = Moment(session.endTime).format();
    let buffered = Moment(sessionEnd).add(2, "hours");
    let bufferedEnd = Moment(buffered).format();
    if (sessionStart <= today && today <= bufferedEnd) {
      this.setState({
        queAccess: "auto",
        AskQFlag: true
      });
    } else {
      this.setState({
        queAccess: "none",
        AskQFlag: false
      });
    }
    setTimeout(() => {
      thisRef.getQuestions();
    }, 500);
  };

  getQuestions = order => {
    let orderRef = order;
    if (orderRef === undefined) {
      orderRef = 'byTime';
    }
    console.warn("orderRef", orderRef);
    let sessionId = this.state.sessionId;
    let eventId = this.state.eventId;

    let thisRef = this;
    let Data = [];
    questionFormService
      .getSessionQuestions(eventId, sessionId, orderRef)
      .then(response => {
        if (response.length > 0) {
          response.forEach(doc => {
            Data.push({ questionSet: doc, questionId: doc._id });
          });
          thisRef.setState({
            questionData: Data,
            questionStatus: false,
            isLoaded: true
          });
        } else {
          thisRef.setState({ questionStatus: true, isLoaded: true });
        }
      })
      .catch(error => {
        thisRef.setState({ questionStatus: true, isLoaded: true });
      });
  };

  onSubmit = () => {
    this.setState({
      componentLoaded: false
    });
    let thisRef = this;

    let questionObj = {
      user: this.state.userId,
      session: this.state.sessionId,
      event: this.state.eventId,
      question: this.state.Question,
      questionAskedTime: new Date(),
      voteCount: 0,
      voters: []
    };
    if (this.state.Question.length !== 0) {
      questionFormService
        .submitSessionQuestions(questionObj)
        .then(response => {
          thisRef.setState({
            Question: "",
            componentLoaded: true
          });
          Alert.alert("Question submitted successfully");
          thisRef.getQuestions();
        })
        .catch(function(error) {
          thisRef.setState({
            componentLoaded: true
          });
        });
    } else {
      Alert.alert("Please fill the question field...");
      thisRef.setState({
        componentLoaded: true
      });
    }
  };
  onChangeInputText = text => {
    let Question = text;
    this.setState({
      Question: Question
    });
  };

  displayQuestions = () => {
    let questionList = this.state.questionData.map(question => {
      let pictureUrl = question.questionSet.user.profileImageURL;
      let avatar;

      if (pictureUrl !== undefined && pictureUrl !== "") {
        avatar = (
          <Image style={this.styles.avatarImage} source={{ uri: pictureUrl }} />
        );
      } else {
        let firstLetter = question.questionSet.user.firstName
          ? question.questionSet.user.firstName[0]
          : "?";
        avatar = (
          <RkText rkType="big" style={styles.avatar}>
            {firstLetter}
          </RkText>
        );
      }
      let user = question.questionSet.user;
      let fullName = user.firstName + " " + user.lastName;
      var votesCount = question.questionSet.voteCount.toString();

      return (
        <View>
          <RkCard style={{ marginLeft: 5, marginRight: 5 }}>
            <View style={{ flexDirection: "row", marginLeft: 3, marginTop: 5 }}>
              <View style={{ flex: 1, flexDirection: "column" }}>{avatar}</View>
              <View style={{ flex: 8, flexDirection: "column", marginLeft: 8 }}>
                <Text style={{ fontStyle: "italic", fontSize: 12 }}>
                  {fullName}
                </Text>

                <View
                  style={{ flexDirection: "row", justifyContent: "center" }}
                >
                  <View style={{ flex: 8, justifyContent: "center" }}>
                    <Text style={{ fontSize: 15 }}>
                      {question.questionSet.question}
                    </Text>
                  </View>
                  <View style={{ flex: 2, justifyContent: "center" }}>
                    {this.checkLikeStatus(question)}
                    <Text style={{ fontSize: 10 }}>{votesCount}</Text>
                  </View>
                </View>

                <View style={{ flex: 8, flexDirection: "row" }}>
                  <View>
                    {this.getDateTime(question.questionSet.questionAskedTime)}
                  </View>
                </View>
              </View>
            </View>
          </RkCard>
        </View>
      );
    });
    return questionList;
  };

  getDateTime = queDateTime => {
    let queDate = Moment(queDateTime).format("DD MMM,YYYY");
    let queTime = Moment(queDateTime).format("hh:mm A");
    return (
      <View>
        <Text style={{ fontSize: 10 }}>
          {queDate} {queTime}
        </Text>
      </View>
    );
  };

  checkLikeStatus = question => {
    let thisRef = this;
    let votes = question.questionSet.voteCount;
    let votersList = question.questionSet.voters;
    let voterStatus = false;
    votersList.forEach(voterId => {
      if (voterId == thisRef.state.userId) {
        voterStatus = true;
      }
    });
    if (voterStatus == true) {
      return (
        //bl
        <Text
          style={{ fontSize: 25, width: 36, height: 36 }}
          onPress={() => this.onUnikeQuestion(question)}
        >
          <Icon name="md-thumbs-up" style={{ color: "#3872d1" }} />
        </Text>
      );
    } else {
      return (
        //gr
        <Text
          style={{ fontSize: 25, width: 36, height: 36 }}
          onPress={() => this.onLikeQuestion(question)}
        >
          <Icon name="md-thumbs-up" style={{ color: "#8c8e91" }} />
        </Text>
      );
    }
  };

  onLikeQuestion = question => {
    let count = 0;

    question.questionSet.voters.forEach(voter => {
      if (this.state.userId === voter) count++;
    });
    let voteCount;
    if (count === 0) {
      question.questionSet.voters.push(this.state.userId);
      voteCount = question.questionSet.voters.length;
    } else return;

    let thisRef = this;
    let questionObj = {
      voters: question.questionSet.voters,
      voteCount: voteCount
    };

    questionFormService
      .updateSessionQuestion(question.questionId, questionObj)
      .then(response => {
        thisRef.getQuestions();
      })
      .catch(error => {
        // console.log("err" + err);
      });
  };

  onUnikeQuestion = question => {
    let thisRef = this;
    let questionId = question.questionId;
    let likedBy = question.questionSet.voters;
    likedBy.pop(this.state.userId);
    let voteCount = likedBy.length;

    let questionObj = {
      voters: question.questionSet.voters,
      voteCount: voteCount
    };

    questionFormService
      .updateSessionQuestion(question.questionId, questionObj)
      .then(response => {
        thisRef.getQuestions();
      })
      .catch(error => {
        console.log("err" + err);
      });
  };

  onTopQueSelect = () => {
    let order = 'byVote';
    if (this.state.topQueView == false) {
      this.setState({
        topQueView: true,
        recentQueView: false,
        orderBy: order
      });
      this.getQuestions(order);
    }
  };
  onRecentQueSelect = () => {
    let order = 'byTime';
    if (this.state.recentQueView == false) {
      this.setState({
        topQueView: false,
        recentQueView: true,
        orderBy: order
      });
      this.getQuestions();
    }
  };

  checkIfLoaded = () => {
    if (this.state.isLoaded == true) {
      return (
        <View>
          <View
            style={{
              alignItems: "center",
              flexDirection: "row",
              width: Platform.OS === "ios" ? 320 : 380,
              marginBottom: 3,
              marginLeft: 2,
              marginRight: 2
            }}
          >
            <View style={{ width: Platform.OS === "ios" ? 160 : 180 }}>
              <GradientButton
                colors={["#f20505", "#f55050"]}
                text="Recent"
                contentStyle={{ fontSize: 12 }}
                style={{
                  fontSize: 15,
                  flexDirection: "row",
                  width: Platform.OS === "ios" ? 150 : 170,
                  marginLeft: 2,
                  marginRight: 1
                }}
                onPress={this.onRecentQueSelect}
              />
            </View>
            <View style={{ width: Platform.OS === "ios" ? 160 : 180 }}>
              <GradientButton
                colors={["#f20505", "#f55050"]}
                text="Top"
                contentStyle={{ fontSize: 12 }}
                style={{
                  fontSize: 15,
                  flexDirection: "row",
                  width: Platform.OS === "ios" ? 150 : 170,
                  marginLeft: 1,
                  marginRight: 2
                }}
                onPress={this.onTopQueSelect}
              />
            </View>
          </View>
          <View>
            <View style={styles.section}>
              <View style={[styles.row, styles.heading]}>
                {this.state.topQueView ? (
                  <RkText style={{ fontSize: 18 }} rkType="header6 primary">
                    Top
                  </RkText>
                ) : null}
              </View>
              <View style={[styles.row, styles.heading]}>
                {this.state.recentQueView ? (
                  <RkText style={{ fontSize: 18 }} rkType="header6 primary">
                    Recent
                  </RkText>
                ) : null}
              </View>
            </View>
            {this.displayQuestions()}
            <View style={[styles.row, styles.heading]}>
              {this.state.questionStatus ? (
                <Text style={{ fontSize: 18 }}>No Questions Found...</Text>
              ) : null}
            </View>
          </View>
        </View>
      );
    } else {
      return (
        <View style={[styles.loading]}>
          <ActivityIndicator size="large" />
        </View>
      );
    }
  };
  render() {
    if (this.state.componentLoaded) {
      return (
        <ScrollView>
          <RkAvoidKeyboard
            onStartShouldSetResponder={e => true}
            onResponderRelease={e => Keyboard.dismiss()}
          >
            {this.state.AskQFlag && (
              <View
                style={{ flexDirection: "row" }}
                pointerEvents={this.state.queAccess}
              >
                <RkTextInput
                  type="text"
                  style={{ width: 300, alignItems: "flex-start" }}
                  placeholder="Enter your question here..."
                  value={this.state.Question}
                  name="Question"
                  onChangeText={text => this.onChangeInputText(text)}
                  maxLength={250}
                />
                <TouchableOpacity onPress={() => this.onSubmit()}>
                  <RkText
                    style={{
                      fontSize: 35,
                      width: 46,
                      height: 46,
                      alignItems: "flex-end"
                    }}
                  >
                    <Icon name="md-send" />{" "}
                  </RkText>
                </TouchableOpacity>
              </View>
            )}
            {!this.state.AskQFlag && (
              <View style={{ flexDirection: "row" }}>
                <RkText
                  style={{
                    fontSize: 15,
                    height: 46,
                    marginRight: 10,
                    marginLeft: 4
                  }}
                >
                  {" "}
                  Questions can be asked only when session is active...{" "}
                </RkText>
              </View>
            )}
            <View>{this.checkIfLoaded()}</View>
          </RkAvoidKeyboard>
        </ScrollView>
      );
    } else {
      return (
        <Container style={styles.root}>
          <View style={styles.loading}>
            <ActivityIndicator size="large" />
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
    marginVertical: 5,
    marginBottom: 4
  },
  descSection: {
    marginVertical: 25,
    marginBottom: 10,
    marginTop: 5
  },
  subSection: {
    marginTop: 5,
    marginBottom: 10
  },
  row: {
    flexDirection: "row",
    paddingHorizontal: 17.5,
    borderColor: theme.colors.border.base,
    alignItems: "center"
  },
  text: {
    marginBottom: 5,
    fontSize: 15,
    marginLeft: 20
  },
  surveButton: {
    alignItems: "baseline",
    flexDirection: "row",
    width: 380,
    marginTop: 8,
    marginBottom: 3,
    marginLeft: 5,
    marginRight: 5
  },
  avatar: {
    backgroundColor: "#C0C0C0",
    width: 40,
    height: 40,
    borderRadius: 20,
    textAlign: "center",
    fontSize: 20,
    textAlignVertical: "center",
    marginRight: 5
  },
  loading: {
    marginTop: 200,
    left: 0,
    opacity: 0.5,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center"
  }
}));
