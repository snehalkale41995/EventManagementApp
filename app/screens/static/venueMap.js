import React from 'react';
import { RkCard, RkStyleSheet, RkText, RkButton } from 'react-native-ui-kitten';
import { Text, View, Container } from 'native-base';
import { ScrollView, Platform, NetInfo, ActivityIndicator, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import getDirections from 'react-native-google-maps-directions';
import { Button } from 'react-native';
import * as infoService from '../../serviceActions/staticPages';
import * as eventService from '../../serviceActions/event';

function renderIf(condition, content) {
  if (condition) {
    return content;
  } else {
    return null;
  }
}

export class VenueMap extends React.Component {
  static navigationOptions = {
    title: 'Location Map'.toUpperCase()
  };

  constructor(props) {
    super(props);
    this.state = {
      isOffline: false,
      locationInfo : {},
      eventInfo : {}
    }
  }

  handleGetDirections = () => {
    let locationData = this.state.locationInfo;
    const data = {
      destination: {
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        latitudeDelta:locationData.latitudeDelta,
        longitudeDelta: locationData.longitudeDelta
      },
      params: [
        {
          key: "travelmode",
          value: "driving"        // may be "walking", "bicycling" or "transit" as well
        },
        {
          key: "dir_action",
          value: "navigate"       // this instantly initializes navigation using the given travel mode 
        }
      ]
    }
    getDirections(data)
  }
  componentWillMount() {
    if (Platform.OS !== 'ios') {
      NetInfo.isConnected.fetch().then(isConnected => {
        if (isConnected) {
          this.getLocationInfo();
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
     this.getLocationInfo();
    NetInfo.addEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange
    );
  }

  handleFirstConnectivityChange = (connectionInfo) => {
    if (connectionInfo.type != 'none') {
       this.getLocationInfo();
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

    getLocationInfo(){
    eventService.getCurrentEvent((eventInfo)=>{
      if(eventInfo){
        let eventId = eventInfo._id;
       infoService.getLocationInfo(eventId).then((response)=>{
        let data = response[0];
        let eventInfo = {
          eventName : data.event.eventName,
          address : data.address
       }
       let locationInfo = {
        latitude: data.latitude,
        longitude: data.longitude,
        latitudeDelta: data.latitudeDelta,
        longitudeDelta: data.longitudeDelta
       }
        this.setState(
          {
           eventInfo:eventInfo,
           locationInfo:locationInfo, 
           isLoaded: true}
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
  
displayMap(){
    let locationInfo = this.state.locationInfo;
    let eventInfo = this.state.eventInfo;
    let eventLatitude = locationInfo.latitude;
    let eventLongitude = locationInfo.longitude;
    return (
      <Container style={[styles.root]}>
        <RkCard rkType='shadowed' style={[styles.card]}>
            <Text style={{ fontSize: 16, fontWeight: 'bold',marginBottom:6 }}>{eventInfo.eventName}</Text> 
            <Text style={{ fontSize: 15, }}>{eventInfo.address}</Text>
        </RkCard>
        <Button onPress={this.handleGetDirections} title="Get Directions">
        </Button>
        <MapView style={styles1.map}
          initialRegion={locationInfo}>
          <Marker
            coordinate={{latitude:eventLatitude,longitude:eventLongitude}}
            title={eventInfo.eventName}
            description={eventInfo.address}
          />
        </MapView>
      </Container>
    )
}

  render() {
  let map = this.displayMap();
        if (this.state.isLoaded) {
            return (
                <Container style={[styles.root]}>
                    <ScrollView>
                        <View>
                           {map}
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

const styles1 = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '10%',
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    position: 'relative',
    top: '0%',
    left: 0,
    right: 0,
    bottom: 0,
    height:'90%'
  },
});

let styles = RkStyleSheet.create(theme => ({
  root: {
    backgroundColor: theme.colors.screen.base,
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