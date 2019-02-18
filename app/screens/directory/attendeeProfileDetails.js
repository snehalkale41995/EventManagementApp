import React from "react";
import {
  Image,
  ScrollView,
  View,
  StyleSheet,
  Alert,
  AsyncStorage,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Linking
} from "react-native";
import {
  RkText,
  RkComponent,
  RkCard,
  RkTextInput,
  RkAvoidKeyboard,
  RkTheme,
  RkStyleSheet
} from "react-native-ui-kitten";
import { Avatar } from "../../components";
import { Icon } from "native-base";
import { BackHandler, ImageBackground } from "react-native";

export class AttendeeProfileDetails extends React.Component {
  static navigationOptions = {
    title: "Profile Details".toUpperCase()
  };

  constructor(props) {
    super(props);
    let { params } = this.props.navigation.state;
    this.attendee = params.attendeeDetails;
    this.state = {
      attendee: this.attendee,
      pictureUrl: this.attendee.profileImageURL
    };
  }
  handleBackPress = () => {
    this.props.navigation.pop();
    return true;
  };
  componentWillMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress);
  }

  displayWebsite(websiteURL) {
    if (websiteURL) {
      Linking.openURL(websiteURL);
    } else return;
  }

  render() {
    if (this.state.pictureUrl) {
      avatar = <Avatar rkType="big" imagePath={this.state.pictureUrl} />;
    } else {
      avatar = (
        <Image
          style={{
            width: 100,
            height: 100,
            borderColor: "#00ffff",
            borderWidth: 2,
            borderRadius: 100
          }}
          source={require("../../../app/assets/images/defaultUserImg.png")}
        />
      );
    }
    return (
      <View style={styles.root}>
        <ScrollView>
          <ImageBackground
            source={require("../../assets/images/profileBack.png")}
            imageStyle=""
            style={{ width: "100%", height: 200 }}
          >
            <View style={{ elevation: 5, paddingTop: 5 }}>
              <View style={{ flexDirection: "column", alignItems: "center" }}>
                <View
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 100,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingTop: 15
                  }}
                >
                  {avatar}
                </View>
              </View>
              <View style={[styles.column, styles.heading]}>
                <RkText style={{ color: "#fff" }} rkType="header4 ">
                  {this.state.attendee.firstName +
                    " " +
                    this.state.attendee.lastName}
                </RkText>
                <RkText rkType="header6">{this.state.attendee.roleName}</RkText>
              </View>
            </View>
          </ImageBackground>
          <View style={styles.section}>
            <View style={[styles.column]}>
              <RkText rkType="header5 primary">Contact Details</RkText>
              <Text style={{ fontSize: 15, textAlign: "justify" }}>
                {this.state.attendee.email}
              </Text>
              <Text style={{ fontSize: 15, textAlign: "justify" }}>
                {this.state.attendee.contact}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 10,
                paddingRight: 10,
                paddingLeft: 10
              }}
            >
              <RkText rkType="header5 primary">Other Details</RkText>
              <Text style={{ fontSize: 15, textAlign: "justify" }}>
                {this.state.attendee.briefInfo}
              </Text>
            </View>
          </View>
          <View style={[styles.column]}>
            <RkText rkType="header5 primary">Social Media</RkText>
            {this.state.attendee.facebookProfileURL &&
            this.state.attendee.linkedinProfileURL ? null : (
              <Text style={{ color: "#999999" }}>Data not available..</Text>
            )}
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {this.state.attendee.facebookProfileURL ? (
              <TouchableOpacity
                onPress={() =>
                  this.displayWebsite(this.state.attendee.facebookProfileURL)}
              >
                <Image
                  style={{ width: 63, height: 63, borderRadius: 100 }}
                  source={require("../../assets/images/fb.png")}
                />
              </TouchableOpacity>
            ) : null}

            {this.state.attendee.linkedinProfileURL ? (
              <TouchableOpacity
                onPress={() =>
                  this.displayWebsite(this.state.attendee.linkedinProfileURL)}
              >
                <Image
                  style={{ width: 68, height: 68, borderRadius: 100 }}
                  source={require("../../assets/images/linkedin.png")}
                />
              </TouchableOpacity>
            ) : null}
          </View>
        </ScrollView>
      </View>
    );
  }
}

let styles = RkStyleSheet.create(theme => ({
  root: {
    flex: 1,
    backgroundColor: "#f2f2f2"
  },
  card: {
    margin: 1,
    padding: 4
  },
  header: {
    backgroundColor: theme.colors.screen.neutral,
    paddingVertical: 25
  },
  section: {
    marginTop: 1
  },
  heading: {
    paddingBottom: 12.5
  },
  column: {
    flexDirection: "column",
    borderColor: theme.colors.border.base,
    alignItems: "center",
    marginTop: 10
  },
  row: {
    flexDirection: "row",
    paddingHorizontal: 17.5,
    //borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border.base,
    alignItems: "center"
  },
  avatar: {
    backgroundColor: "#C0C0C0",
    width: 100,
    height: 100,
    borderRadius: 60,
    textAlign: "center",
    fontSize: 40,
    textAlignVertical: "center",
    marginRight: 5,
    alignSelf: "center"
  }
}));
