import React from 'react';
import { ScrollView, Platform, Image, NetInfo} from 'react-native';
import { Text, View, Icon, Container, Label } from 'native-base';
import { StyleSheet, FlatList, TouchableOpacity, Keyboard, Alert, AsyncStorage, ActivityIndicator, Linking } from 'react-native';
import { RkComponent, RkTheme, RkStyleSheet, RkText, RkAvoidKeyboard, RkButton, RkCard, RkChoice, RkTextInput, RkChoiceGroup } from 'react-native-ui-kitten';
import { NavigationActions } from 'react-navigation';
import ReactMoment from 'react-moment';
import { GradientButton } from '../../components/gradientButton';
import { Avatar } from '../../components';
import * as sponsorService from '../../serviceActions/staticPages';
import * as eventService from '../../serviceActions/event';
import {Loader} from '../../components/loader';
import {Footer} from '../../components/footer';
import {EmptyData} from '../../components/emptyData';

export class Sponsors extends RkComponent {
    static navigationOptions = {
        title: 'Sponsors'.toUpperCase()
    };
    constructor(props) {
        super(props);
        this.state = {
            Sponsors: [],
            isLoaded: false,
            isOffline: false,
            noDataFlag : false
        }
    }

     componentWillMount() {
        if (Platform.OS !== 'ios') {
            NetInfo.isConnected.fetch().then(isConnected => {
                if (isConnected) {
                    this.getSponsorsList();
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
        this.getSponsorsList();
        NetInfo.addEventListener(
            'connectionChange',
            this.handleFirstConnectivityChange
        );
    }

    handleFirstConnectivityChange = (connectionInfo) => {
        if (connectionInfo.type != 'none') {
            this.getSponsorsList();
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

    getSponsorsList() {
        let thisRef = this;
        let sponserCollection = [];
        eventService.getCurrentEvent((eventInfo)=>{
        if(eventInfo){
        let eventId = eventInfo._id;
        sponsorService.getSponsorInfo(eventId).then((response)=>{
        if(response.length === 0){
        this.setState({
         isLoaded: true,
        noDataFlag : true
        })  
         } 
         else{     
            this.setState({
            Sponsors: response,
            isLoaded: true,
            noDataFlag : false
          })
         }
      }).catch((error)=>{
        this.setState({
             isLoaded: false,
             noDataFlag : true
        })
       })
       }
    })
    }
  
     displayWebsite(websiteURL){
     if(websiteURL){
      Linking.openURL(websiteURL); 
     }
      else return;
     }

    displaySponsors = () => {
        return this.state.Sponsors.map((sponsor, index) => {
            let avatar;
            if (sponsor.imageURL) {
                avatar = <Image style={{ width: 60, height: 60 }} source={{ uri: sponsor.imageURL }} />
            } else {
                avatar = <Image style={{ width: 60, height: 60 }} source={require('../../assets/images/defaultSponsorImg.png')} />
            }
            return (
                <TouchableOpacity onPress={() => this.displayWebsite(sponsor.websiteURL)}>
                    <RkCard rkType='shadowed' style={[styles.card]}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flexDirection: 'column', alignItems: 'flex-start', marginVertical: 10, flex: 3, alignSelf: 'center', marginLeft: 10 }}>
                                {avatar}
                            </View>
                            <View style={{ flexDirection: 'column', alignItems: 'flex-start', marginVertical: 10, flex: 6, marginLeft: -10 }}>
                                <Text style={styles.headerText}>{sponsor.category}</Text>
                                <Text style={styles.infoText}>{sponsor.name}</Text>
                            </View >
                        </View >
                    </RkCard>
                </TouchableOpacity>
            )
        });
    }

        render() {
        let sponsorList = this.displaySponsors();
        if (this.state.isLoaded && !this.state.noDataFlag) {
            return (
                <Container style={[styles.root]}>
                    <ScrollView>
                        <View>
                             {sponsorList} 
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
    card: {
        margin: 1,
        padding: 4
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 16
    },
    infoText: {
        fontSize: 12
    }
}));