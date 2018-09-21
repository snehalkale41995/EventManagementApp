import React from 'react';
import { RkText, RkStyleSheet } from 'react-native-ui-kitten';
import { Container } from 'native-base';
import { Image, ScrollView, View, StyleSheet, Alert, AsyncStorage, ActivityIndicator, Text, Linking, TouchableOpacity,Platform,NetInfo } from 'react-native';
import { scale, scaleModerate, scaleVertical } from '../../utils/scale';
import * as infoService from '../../serviceActions/staticPages';
import * as eventService from '../../serviceActions/event';
import {Loader} from '../../components/loader';
import {Footer} from '../../components/footer';
import {EmptyData} from '../../components/emptyData';

function renderIf(condition, content) {
  if (condition) {
    return content;
  } else {
    return null;
  }
}

export class AboutEternus extends React.Component {
  static navigationOptions = {
    title: 'About Eternus'.toUpperCase()
  };

  constructor(props) {
    super(props);
    this.state = {
      isOffline: false,
      eternusInfo :{},
      isLoaded: false,
      noDataFlag : false
    }
  }

  componentWillMount() {
    if (Platform.OS !== 'ios') {
      NetInfo.isConnected.fetch().then(isConnected => {
        if (isConnected) {
          this.getEternusInfo();
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
     this.getEternusInfo();
    NetInfo.addEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange
    );
  }

  handleFirstConnectivityChange = (connectionInfo) => {
    if (connectionInfo.type != 'none') {
       this.getEternusInfo();
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

  getEternusInfo(){
    eventService.getCurrentEvent((eventInfo)=>{
      if(eventInfo){
       infoService.getEternusInfo().then((response)=>{
         if(response.length === 0){
            this.setState({
              isLoaded: true,
              noDataFlag : true,
            })  
         }
        else{
        this.setState({
           eternusInfo: response[0],
           isLoaded: true,
           noDataFlag : false
        });
         }
        }).catch((error)=>{
         this.setState({
              isLoaded: true,
              noDataFlag : true
            })  
       })
      }
      else{
        return;
      }
    })
  }
  
    displayInformation = () => {
    let eternusInfo = this.state.eternusInfo;
    return (
      <Container>
        <ScrollView style={styles.root}>
          <View style={styles.header}>
            <Image style={styles.eternusLogo} source={require('../../assets/images/eternusLogoMain.png')} />
          </View>
          <View style={styles.section} pointerEvents='auto'>
            <View style={[styles.row]}>
              <Text
                style={{
                  fontSize: 15,
                  textAlign: 'justify'
                }}>
              {eternusInfo.info}
             </Text>
            </View >
            <TouchableOpacity onPress={() => Linking.openURL('https://www.eternussolutions.com/')}>
              <Text style={{ color: 'blue', fontSize: 15, textAlign: 'center', marginTop: 15 }}>
               {eternusInfo.url}
        </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Container>
    );
  }

  render() {
  let Info = this.displayInformation();
        if (this.state.isLoaded && !this.state.noDataFlag) {
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
         else if(this.state.isLoaded && this.state.noDataFlag){
          return (<EmptyData isOffline ={this.state.isOffline}/>)
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
