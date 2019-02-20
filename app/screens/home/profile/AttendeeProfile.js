import React from 'react';
import { Image, Linking,ScrollView, View, StyleSheet, Alert, AsyncStorage, ActivityIndicator ,  TouchableOpacity,
  Text} from 'react-native';
import { RkText,RkComponent, RkTextInput, RkAvoidKeyboard, RkTheme, RkStyleSheet } from 'react-native-ui-kitten';
import {data} from '../../../data';
import {Avatar} from '../../../components';
import {GradientButton} from '../../../components';
export class AttendeeProfile extends RkComponent {
    constructor(props) {
        super(props);
        let {params} = this.props.navigation.state;
        this.speaker = params.speakerDetails;
        this.state = {
            speaker : this.speaker,
            pictureUrl: this.speaker.profileImageURL
        }
    }
    displayWebsite(websiteURL) {
      if (websiteURL) {
        Linking.openURL(websiteURL);
      } else return;
    }
      render() {
        let avatar;
         let speakerName = "";
         let speakerInfo = "";
         if(this.state.speaker.info){
           speakerInfo = this.state.speaker.info;
         }
         speakerName = this.state.speaker.firstName + " " + this.state.speaker.lastName;
        if (this.state.pictureUrl) {
            avatar = <Avatar  rkType='big'  imagePath={this.state.pictureUrl} />
        } else {
            //let firstLetter = this.state.speaker.firstName ?  this.state.speaker.firstName[0]: '?';
            //avatar = <RkText rkType='big'  style={styles.avatar}>{firstLetter}</RkText>
            avatar = <Image style={{width: 100,height: 100, marginLeft:'auto', marginRight:'auto'}} source={require('../../../assets/images/defaultUserImg.png')}/>
        }
        return (
            <ScrollView>
               <View style={styles.header}>
                {avatar}
              </View>
              <View style={styles.section} >
                <View style={[styles.column, styles.heading]}>
                  <RkText rkType='header6 primary'>{speakerName}</RkText>
                  <RkText style={{fontSize : 15, textAlign: 'center'}} rkType="small">{this.state.speaker.briefInfo}</RkText>
                </View>
                <View style={{flexDirection:'row',alignContent:'center',justifyContent:'center',padding:5, marginTop:-5}}>
                {this.state.speaker.linkedinProfileURL ? (
              <TouchableOpacity
                onPress={() =>
                  this.displayWebsite(this.state.speaker.linkedinProfileURL)}
              >
                <Image
                  style={[styles.sociallogo]}
                  source={require("../../../assets/images/linkedin.png")}
                />
              </TouchableOpacity>
            ) : <Image
            style={[styles.sociallogo]}
            source={require("../../../assets/images/linkedinDisabled.png")}
          />}

          {this.state.speaker.facebookProfileURL ? (
              <TouchableOpacity
                onPress={() =>
                  this.displayWebsite(this.state.speaker.facebookProfileURL)}
              >
                <Image
                  style={[styles.sociallogo]}
                  source={require("../../../assets/images/fb.png")}
                />
              </TouchableOpacity>
            ) : <Image
            style={[styles.sociallogo]}
            source={require("../../../assets/images/fbDisabled.png")}
          />}
          {this.state.speaker.twitterProfileURL ? (
            <TouchableOpacity
              onPress={() =>
                this.displayWebsite(this.state.speaker.twitterProfileURL)}
            >
              <Image
                style={[styles.sociallogo]}
                source={require("../../../assets/images/twitter.png")}
              />
            </TouchableOpacity>
          ) : <Image
          style={[styles.sociallogo]}
          source={require("../../../assets/images/twitterDisabled.png")}
        />}
        </View>
                <View style={[styles.row]}>
                  <Text style={{fontSize : 15, textAlign: 'justify'}}>
                    {speakerInfo}
                  </Text>
                </View>
              </View>   
          </ScrollView>
        )
      }
}

let styles = RkStyleSheet.create(theme => ({
    header: {
      backgroundColor: theme.colors.screen.neutral,
      paddingVertical: 25
    },
    section: {
     marginTop : 1
    },
    heading: {
      paddingBottom: 12.5
    },
    column:{
      flexDirection : 'column',
      borderColor: theme.colors.border.base,
      alignItems: 'center'
    },
    row: {
      flexDirection: 'row',
      paddingHorizontal: 17.5,
      //borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border.base,
      alignItems: 'center'
    },
    avatar: {
      backgroundColor: '#C0C0C0',
      width: 100,
      height: 100,
      borderRadius: 60,
      textAlign: 'center',
      fontSize: 40,
      textAlignVertical: 'center',
      marginRight: 5,
      alignSelf: 'center'
  },
  sociallogo:{
    width: 50,
    height: 50,
    borderRadius: 100,
    padding:7
  }
  }));
