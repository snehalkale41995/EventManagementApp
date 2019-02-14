import React from 'react';
import { Image, ScrollView, View, StyleSheet, Alert, AsyncStorage, ActivityIndicator ,Text,TouchableOpacity,Linking} from 'react-native';
import { RkText,RkComponent,RkCard, RkTextInput, RkAvoidKeyboard, RkTheme, RkStyleSheet } from 'react-native-ui-kitten';
import {Avatar} from '../../components';
import {Icon} from "native-base";
import { BackHandler } from 'react-native';

export class AttendeeProfileDetails extends  React.Component {
  static navigationOptions = {
    title: 'Profile Details'.toUpperCase()
  };
  
    constructor(props) {
        super(props);
        let {params} = this.props.navigation.state;
        this.attendee = params.attendeeDetails;
       //console.warn('100000',this.attendee)
        this.state = {
          attendee : this.attendee,
          pictureUrl: this.attendee.profileImageURL
        }
    }
    handleBackPress=()=>{
      this.props.navigation.pop();
      return true;        
  }
  componentWillMount(){
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

  }
  componentWillUnmount(){
    BackHandler.removeEventListener('hardwareBackPress',this.handleBackPress);
  }

  displayWebsite(websiteURL){
    //console.warn("websiteURL", websiteURL)
    if(websiteURL){
     Linking.openURL(websiteURL); 
    }
     else return;
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
            avatar = <Image style={{width: 100,height: 100,marginBottom:18}} source={require('../../../app/assets/images/defaultUserImg.png')}/>
        }
        return (
          <View style={styles.root}>
            <ScrollView>
               
               <View style={{flexDirection : 'column', alignItems: 'center',}}>
               <View style={{width: 110, height: 110,borderColor:'#f20505',borderWidth:2,borderRadius:100,justifyContent:'center',alignItems:'center',paddingTop:18}}>

                {avatar}
                </View>
              </View>
              <View style={styles.section}>
                <View style={[styles.column, styles.heading]}>
                  <RkText rkType='header6 primary'>{this.state.attendee.firstName+' '+this.state.attendee.lastName}</RkText>
                  <RkText rkType='header6'>{this.state.attendee.roleName}</RkText>
        {/* <RkText style={{fontSize : 15, textAlign: 'center'}} rkType="small">{this.state.speaker.briefInfo}</RkText> */}
                </View>
                <View style={[styles.column]}>
                <RkText rkType='header5 primary'>Contact Details</RkText>
                  <Text style={{fontSize : 15, textAlign: 'justify'}}>
                    {this.state.attendee.email}
                  </Text>
                  <Text style={{fontSize : 15, textAlign: 'justify'}}>
                    {this.state.attendee.contact}
                  </Text>
                </View>
                <View style={{alignItems:'center',justifyContent:'center'}}>

                <TouchableOpacity  onPress={() => this.displayWebsite(this.state.attendee.facebookProfileURL)}>
                  <Image style={{ width: 63, height: 63,borderRadius:100}} source={require('../../assets/images/fb.png')} />
                </TouchableOpacity>
               
                <TouchableOpacity  onPress={() => this.displayWebsite(this.state.attendee.linkedinProfileURL)} >
                  <Image style={{ width: 63, height: 63,borderRadius:100}} source={require('../../assets/images/linkedin.png')} />
                </TouchableOpacity>
                </View>

                <View style={[styles.column]}>
                <RkText rkType='header5 primary'>Other Details</RkText>
                  <Text style={{fontSize : 15, textAlign: 'justify'}}>
                    {this.state.attendee.briefInfo}
                  </Text>
                </View>
                </View>
                {/* <RkCard rkType='shadowed' style={[styles.card]}>
                <View style={{ flexDirection: 'row',elevation:3 }}>
                      <View style={{ flexDirection: 'column', alignItems: 'flex-start', marginVertical: 10, flex: 6, marginLeft: -10 }}>
                          <Text style={{fontSize : 15, textAlign: 'justify'}}>
                            {this.state.attendee.contact}
                          </Text>
                      </View >
                    </View >
                </RkCard> */}
          </ScrollView>
          </View>
        ) 
      }
}

let styles = RkStyleSheet.create(theme => ({
  root: {
    flex:1,
    backgroundColor: '#fff',
    paddingTop:20
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
     marginTop : 1,
    },
    heading: {
      paddingBottom: 12.5
    },
    column:{
      flexDirection : 'column',
      borderColor: theme.colors.border.base,
      alignItems: 'center',
      marginTop : 10,

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
