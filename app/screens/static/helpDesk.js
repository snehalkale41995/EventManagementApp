import React from 'react';
import { RkText, RkStyleSheet, RkCard} from 'react-native-ui-kitten';
import { Container } from 'native-base';
import { Image, ScrollView, View, StyleSheet, Alert, AsyncStorage, ActivityIndicator, Text, Linking, TouchableOpacity,Platform,NetInfo } from 'react-native';
import { scale, scaleModerate, scaleVertical } from '../../utils/scale';
import * as infoService from '../../serviceActions/staticPages';
import * as eventService from '../../serviceActions/event';
import Autolink from 'react-native-autolink';

function renderIf(condition, content) {
  if (condition) {
    return content;
  } else {
    return null;
  }
}
export class HelpDesk extends React.Component {
  static navigationOptions = {
    title: 'HELP DESK'.toUpperCase()
  };

  constructor(props) {
    super(props);
    this.state = {
      isOffline: false,
      deskInfo :{},
      isLoaded: false,
      eventContact : "",
      techContact : ""
    }
  }

  componentWillMount() {
    if (Platform.OS !== 'ios') {
      NetInfo.isConnected.fetch().then(isConnected => {
        if (isConnected) {
          this.getHelpDeskInfo();
          this.setState({
            isLoading: true
          });
        } else {
          this.setState({
            isLoading: false,
            isOffline: true
          });
        }
        this.setState({
          isOffline: !isConnected
        });
      });
    }
     this.getHelpDeskInfo();
    NetInfo.addEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange
    );
  }

  handleFirstConnectivityChange = (connectionInfo) => {
    if (connectionInfo.type != 'none') {
       this.getHelpDeskInfo();
      this.setState({
        isLoading: true
      });
    } else {
      this.setState({
        isLoading: false,
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

  getHelpDeskInfo(){
    eventService.getCurrentEvent((deskInfo)=>{
      if(deskInfo){
       let eventId = deskInfo._id;
       infoService.getHelpDeskInfo(eventId).then((response)=>{
        this.setState(
          {
            deskInfo: response[0],
            eventContact : response[0].eventSupportContact.toString(),
            techContact : response[0].techSupportContact.toString(),
            isLoaded: true
          }
        )
      }).catch((error)=>{
        console.log(error);
       })
       }
      else{
        return;
      }
    })
  }

    displayInformation = () => {
    let eventContact= "+91-"+this.state.eventContact+" ";
    let techContact= "+91-"+this.state.techContact+" ";
    let deskInfo = this.state.deskInfo;
    return (
      <Container>
      <ScrollView>
          <View>
            <RkCard rkType='shadowed' style={[styles.card]}>
            <Text style={{ fontSize: 19, fontWeight: 'bold',marginBottom:10 }}>Event Support</Text> 
            <Text style={{ fontSize: 16, color:'grey' }}>Phone: <Autolink text={eventContact}></Autolink></Text>      
            <Text style={{ fontSize: 16, color:'grey' }}>Email: <Autolink text={deskInfo.eventSupportEmail}></Autolink></Text> 
            </RkCard>
            <RkCard rkType='shadowed' style={[styles.card]}>
            <Text style={{ fontSize: 19, fontWeight: 'bold',justifyContent: 'center', marginBottom:10}}>Technical Support</Text>
            <Text style={{ fontSize: 16, color:'grey' }}>Phone: <Autolink text={techContact}></Autolink></Text> 
            <Text style={{ fontSize: 16, color:'grey' }}>Email: <Autolink text={deskInfo.techSupportEmail}></Autolink></Text>          
            </RkCard>
            <Text/>
            <Text/>
          </View>
        </ScrollView>
        <View style={styles.footerOffline}>
          {
            this.state.isOffline ? <RkText rkType="small" style={styles.footerText}>The Internet connection appears to be offline. </RkText> : null
          }
        </View>
        <View style={styles.footer}>
          <RkText rkType="small" style={styles.footerText}>Powered by</RkText>
          <RkText rkType="small" style={styles.companyName}> Eternus Solutions Pvt. Ltd. </RkText>
        </View>
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
                    <View style={[styles.footerOffline]}>
                        {
                            this.state.isOffline ? <RkText rkType="small" style={[styles.footerText]}>The Internet connection appears to be offline. </RkText> : null
                        }
                    </View>
                    <View style={[styles.footer]}>
                        <RkText rkType="small" style={[styles.footerText]}>Powered by</RkText>
                        <RkText rkType="small" style={[styles.companyName]}> Eternus Solutions Pvt. Ltd. </RkText>
                    </View>
                </Container>
            )
        }
        else {
            return (
                <Container style={[styles.root]}>
                    <ScrollView>
                    <View style={[styles.loading]}>
                        <ActivityIndicator size='small' />
                    </View>
                    </ScrollView>
                    <View style={[styles.footerOffline]}>
                        {
                            this.state.isOffline ? <RkText rkType="small" style={[styles.footerText]}>The Internet connection appears to be offline. </RkText> : null
                        }
                    </View>
                    <View style={[styles.footer]}>
                        <RkText rkType="small" style={[styles.footerText]}>Powered by</RkText>
                        <RkText rkType="small" style={[styles.companyName]}> Eternus Solutions Pvt. Ltd. </RkText>
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
  },
   card: {
    margin: 2,
    padding: 6,
    justifyContent:'flex-start'
}
}));
