import React from 'react';
import {ActivityIndicator, ScrollView} from 'react-native';
import {View} from 'native-base';
import {RkStyleSheet} from 'react-native-ui-kitten';

export class Loader extends React.Component {
  render() {
    return (
      <ScrollView>
      <View style={[styles.loading]}>
      <ActivityIndicator size='small'/>
      </View>
      </ScrollView>
    )
  }
}

let styles = RkStyleSheet.create(theme => ({
    loading: {
        marginTop: 200,
        left: 0,
        opacity: 0.5,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    }
}));