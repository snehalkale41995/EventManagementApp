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
export class VenueMap extends React.Component {
  static navigationOptions = {
    title: 'Location Map'.toUpperCase()
  };

  constructor(props) {
    super(props);
    this.state = {
      isOffline: false,
      locationInfo : {},
      eventInfo : {},
      isLoaded: false,
      noDataFlag : false
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
     this.getLocationInfo();
    NetInfo.addEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange
    );
  }

  handleFirstConnectivityChange = (connectionInfo) => {
    if (connectionInfo.type != 'none') {
       this.getLocationInfo();
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

    getLocationInfo(){
    eventService.getCurrentEvent((eventInfo)=>{
      if(eventInfo){
        let eventId = eventInfo._id;
       infoService.getLocationInfo(eventId).then((response)=>{
        if(response.length === 0){
            this.setState({
              isLoaded: true,
              noDataFlag : true
            })  
         }
         else{  
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
        if (this.state.isLoaded && !this.state.noDataFlag) {
            return (
                <Container style={[styles.root]}>
                    <ScrollView>
                        <View>
                           {map}
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
  card: {
    margin: 2,
    padding: 6,
    justifyContent:'flex-start'
}
}));