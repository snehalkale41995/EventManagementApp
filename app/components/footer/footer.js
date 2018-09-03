import React from 'react';
import {ActivityIndicator, ScrollView} from 'react-native';
import {View} from 'native-base';
import {RkStyleSheet, RkText} from 'react-native-ui-kitten';

export class Footer extends React.Component {
  render() {
    return (
    <View>
       <View  style={[styles.footerOffline]}>
        {
        this.props.isOffline ? <RkText rkType="small" style={[styles.footerText]}>The Internet connection appears to be offline. </RkText> : null
         }
         </View>
        <View style={[styles.footer]}>
        <RkText rkType="small" style={[styles.footerText]}>Powered by</RkText>
        <RkText rkType="small" style={[styles.companyName]}> Eternus Solutions Pvt. Ltd. </RkText>
        </View>
     </View>
    )
  }
}

let styles = RkStyleSheet.create(theme => ({
   footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#E7060E'
  },
  footerOffline: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#545454'
  },
  footerText: {
    color: '#f0f0f0',
    fontSize: 11,
  },
  companyName: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold'
  }
}));