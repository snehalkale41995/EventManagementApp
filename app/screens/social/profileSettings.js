import React from "react";
import { ActivityIndicator, ScrollView} from "react-native";
import { View, Text, Container} from "native-base";
import { RkStyleSheet } from "react-native-ui-kitten";

export default class ProfileSettings extends React.Component {
  render() {
    return (
      <Container style={[styles.root]}>
        <ScrollView>
          <View style={[styles.emptydata]}>
            <Text>No Data Found</Text>
          </View>
        </ScrollView>
      </Container>
    );
  }
}

let styles = RkStyleSheet.create(theme => ({
  root: {
    backgroundColor: theme.colors.screen.base
  },
  emptydata: {
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











