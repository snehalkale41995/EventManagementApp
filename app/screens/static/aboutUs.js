import React from 'react';
import { RkText, RkStyleSheet } from 'react-native-ui-kitten';
import { Container } from 'native-base';
import { Image, ScrollView, View, StyleSheet, Alert, AsyncStorage, ActivityIndicator, Text, Linking, TouchableOpacity,Platform,NetInfo } from 'react-native';
import { scale, scaleModerate, scaleVertical } from '../../utils/scale';
import * as infoService from '../../serviceActions/staticPages';
import * as eventService from '../../serviceActions/event';
import {Loader} from '../../components/loader';
import {Footer} from '../../components/footer';

function renderIf(condition, content) {
  if (condition) {
    return content;
  } else {
    return null;
  }
}

export class AboutUs extends React.Component {
  static navigationOptions = {
    title: 'About Event'.toUpperCase()
  };

  constructor(props) {
    super(props);
    this.state = {
      isOffline: false,
      eventInfo :{},
      isLoaded: false
    }
  }

  componentWillMount() {
    if (Platform.OS !== 'ios') {
      NetInfo.isConnected.fetch().then(isConnected => {
        if (isConnected) {
          this.getEventInfo();
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
     this.getEventInfo();
    NetInfo.addEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange
    );
  }

  handleFirstConnectivityChange = (connectionInfo) => {
    if (connectionInfo.type != 'none') {
      this.getEventInfo();
    } else {
      this.setState({
        isOffline: true
      });
    }
    this.setState({
      isOffline: connectionInfo.type === 'none',
    });
  };

  componentWillUnmount() {
    NetInfo.removeEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange
    );
  }

  getEventInfo(){
    eventService.getCurrentEvent((eventInfo)=>{
      if(eventInfo){
       let eventId = eventInfo._id;
       infoService.getEventInfo(eventId).then((response)=>{
        this.setState(
          {
            eventInfo: response[0],
            eventLogo : eventInfo.eventLogo,
            isLoaded: true
          }
        )
      }).catch((error)=>{
       // console.log(error);
       })
       }
      else{
        return;
      }
    })
  }

    displayInformation = () => {
    let eventInfo = this.state.eventInfo;
    let eventLogo = this.state.eventLogo;
    let url = eventInfo.url;
     let avatar;
            if (eventLogo) {
                avatar = <Image style={styles.eternusLogo} source={{ uri: eventLogo }} />
            } else {
                avatar = <Image style={styles.eternusLogo} source={require('../../assets/images/defaultSponsorImg.png')} />
            }
    return (
      <Container>
        <ScrollView style={styles.root}>
          <View style={styles.header}>
            {avatar}
          </View>
          <View style={styles.section} pointerEvents='auto'>
            <View style={[styles.row]}>
              <Text
                style={{
                  fontSize: 15,
                  textAlign: 'justify'
                }}>
              {eventInfo.info}
             </Text>
            </View >
            <TouchableOpacity onPress={() => Linking.openURL(url)}>
              <Text style={{ color: 'blue', fontSize: 15, textAlign: 'center', marginTop: 15 }}>
               {eventInfo.url}
        </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Container>
    );
  }

  render() {
  let Info = this.displayInformation();
        if (this.state.isLoaded) {
            return (
                <Container style={[styles.root]}>
                    <ScrollView>
                        <View>
                           {Info}
                        </View>
                    </ScrollView>
                  <View>
                  <Footer isOffline ={this.state.isOffline}/>    
                  </View>
                </Container>
            )
        }
        else {
            return (
               <Container style={[styles.root]}>
                    <Loader/> 
                    <View>
                    <Footer isOffline ={this.state.isOffline}/> 
                    </View>
                </Container>
            )
        }
  }
}

let styles = RkStyleSheet.create(theme => ({
  root: {
    backgroundColor: theme.colors.screen.base
  },
  header: {
    backgroundColor: theme.colors.screen.base,
    paddingVertical: 25
  },
  section: {
    backgroundColor: theme.colors.screen.base,
    marginTop: 1
  },
  column: {
    flexDirection: 'column',
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
  eternusLogo: {
    height: 80,
    width: 180,
    /*height: scaleVertical(55),*/
    resizeMode: 'contain',
    marginLeft: 'auto',
    marginRight: 'auto',
  }
}));
