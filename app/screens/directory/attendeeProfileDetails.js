import React from 'react';
import { Image, ScrollView, View, StyleSheet, Alert, AsyncStorage, ActivityIndicator ,Text} from 'react-native';
import { RkText,RkComponent, RkTextInput, RkAvoidKeyboard, RkTheme, RkStyleSheet } from 'react-native-ui-kitten';
import {Avatar} from '../../components';
import {Icon} from "native-base";

export class AttendeeProfileDetails extends  React.Component {

  
    constructor(props) {
        super(props);
        let {params} = this.props.navigation.state;
        this.attendee = params.attendeeDetails;
        
        this.state = {
          attendee : this.attendee,
          pictureUrl: this.attendee.profileImageURL
        }
    }
      render() {
        // let avatar;
        //  let speakerName = "";
        //  let speakerInfo = "";
        //  if(this.state.speaker.info){
        //    speakerInfo = this.state.speaker.info;
        //  }
        //  speakerName = this.state.speaker.firstName + " " + this.state.speaker.lastName;
        if (this.state.pictureUrl) {
            avatar = <Avatar  rkType='big'  imagePath={this.state.pictureUrl} />
        } else {
            //let firstLetter = this.state.speaker.firstName ?  this.state.speaker.firstName[0]: '?';
            //avatar = <RkText rkType='big'  style={styles.avatar}>{firstLetter}</RkText>
            avatar = <Image style={{width: 100,height: 100, marginLeft:'auto', marginRight:'auto'}} source={require('../../../app/assets/images/defaultUserImg.png')}/>
        }
        return (
            <ScrollView>
               
               <View style={styles.header}>
                {avatar}
              </View>
              <View style={styles.section} pointerEvents='none'>
                <View style={[styles.column, styles.heading]}>
                  <RkText rkType='header6 primary'>{this.state.attendee.firstName+' '+this.state.attendee.lastName}</RkText>
                  <RkText rkType='header6'>{this.state.attendee.roleName}</RkText>
        {/* <RkText style={{fontSize : 15, textAlign: 'center'}} rkType="small">{this.state.speaker.briefInfo}</RkText> */}
                </View>
                <View style={[styles.row]}>

                <RkText rkType='header6'>Contact Details</RkText>
                </View>
                <View style={[styles.row]}>
                  <Text style={{fontSize : 15, textAlign: 'justify'}}>
                    {this.state.attendee.email}
                  </Text>
                </View> 
                <View style={[styles.row]}>
                  <Text style={{fontSize : 15, textAlign: 'justify'}}>
                    {this.state.attendee.contact}
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
  }
  }));
