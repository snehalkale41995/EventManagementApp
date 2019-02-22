import React from 'react';
import { ScrollView, Platform, Image, NetInfo } from 'react-native';
import { Text, View, Icon, Container, Label } from 'native-base';
import { StyleSheet, FlatList, TouchableOpacity, Keyboard, Alert, AsyncStorage, ActivityIndicator } from 'react-native';
import { RkComponent, RkTheme, RkStyleSheet, RkText, RkAvoidKeyboard, RkButton, RkCard, RkChoice, RkTextInput, RkChoiceGroup } from 'react-native-ui-kitten';
import { NavigationActions } from 'react-navigation';
import ReactMoment from 'react-moment';
import { GradientButton } from '../../components/gradientButton';
import Moment from 'moment';
import { Avatar } from '../../components';
import * as eventServices from '../../serviceActions/event';
import {Loader} from '../../components/loader';
import {Footer} from '../../components/footer';
import * as speakerService from '../../serviceActions/speaker';
import * as eventService from '../../serviceActions/event';
import withPreventDoubleClick from '../../components/withPreventDoubleClick/withPreventDoubleClick';
const TouchableOpacityEx = withPreventDoubleClick(TouchableOpacity);
import { BackHandler } from 'react-native';

export class Speakers extends RkComponent {
    static navigationOptions = {
        title: 'Speakers'.toUpperCase()
    };
    constructor(props) {
        super(props);

        this.state = {
            Speakers: [],
            isLoaded: false,
            isOffline: false,
            eventId : " "
        }
    }
    handleBackPress=()=>{
        this.props.navigation.replace('HomeMenu');
        return true;        
    }
    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress',this.handleBackPress);

        if (Platform.OS !== 'ios') {
            NetInfo.isConnected.fetch().then(isConnected => {
                if (isConnected) {
                    this.getSpeakersList();
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
        this.getSpeakersList();
        NetInfo.addEventListener(
            'connectionChange',
            this.handleFirstConnectivityChange
        );
    }

    handleFirstConnectivityChange = (connectionInfo) => {
        if (connectionInfo.type != 'none') {
            this.getSpeakersList();
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
        BackHandler.removeEventListener('hardwareBackPress',this.handleBackPress);

        NetInfo.removeEventListener(
            'connectionChange',
            this.handleFirstConnectivityChange
        );
    }

    getSpeakersList() {
        let thisRef = this;
        eventService.getCurrentEvent((eventInfo)=>{
        if(eventInfo){
        let eventId = eventInfo._id;
        this.setState({eventId:eventId});
        speakerService.getSpeakersByEvent(eventId).then((response)=>{
        this.setState(
          {
            Speakers: response,
            isLoaded: true
          }
        )
      }).catch((error)=>{
        this.setState({ isLoaded: false})
       })
       }
    })
    }

    displaySpeakers = () => {
        return this.state.Speakers.map((speaker, index) => {
            let avatar;
            let speakerName = "";
            speakerName = speaker.firstName + " " + speaker.lastName;
            speaker.profileImageURL =  speaker.profileImageURL+ '?rnd=' + Math.random();
            if (speaker.profileImageURL) {
                avatar = <Avatar rkType='large' style={{ width: 44, height: 44, borderRadius: 60 }} imagePath={speaker.profileImageURL} />
            } else {
                avatar = <Image style={{ width: 34, height: 34 }} source={require('../../assets/images/defaultUserImg.png')} />
            }
            return (
                <TouchableOpacityEx
                    key={index} onPress={() => this.props.navigation.navigate('SpeakerDetailsTabs', { speakerDetails: speaker, speakersId: speaker._id, eventId : this.state.eventId})}
                >
                    <RkCard rkType='shadowed' style={styles.card}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flexDirection: 'column', alignItems: 'flex-start', marginVertical: 10, marginLeft: 5, width: 50, flex: 2 }}>
                                {avatar}
                            </View>
                            <View style={{ flexDirection: 'column', marginVertical: 10, flex: 7, marginLeft: 5 }}>
                                <Text style={styles.headerText}>{speakerName}</Text>
                                <Text style={styles.infoText}>{speaker.briefInfo}</Text>
                            </View >
                            <View style={{ flexDirection: 'column', alignContent: 'flex-end', marginRight: 5, marginVertical: 15, flex: 3 }}>
                                <RkText style={{ alignSelf: 'flex-end' }} ><Icon name="ios-arrow-forward" /></RkText>
                            </View>
                        </View >
                    </RkCard>
                </TouchableOpacityEx>
            )
        });
    }
    render() {
       let speakerList = this.displaySpeakers();
        if (this.state.isLoaded) {
            return (
                <Container style={[styles.root]}>
                    <ScrollView>
                         <View>
                            {speakerList}
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
    card: {
        margin: 1,
        padding: 4,
        height: 75
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 16
    },
    infoText: {
        fontSize: 12
    }
}));