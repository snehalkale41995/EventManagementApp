import React from 'react';
import { ScrollView, Platform, Image, NetInfo,TextInput} from 'react-native';
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
import RegisterUserToSession from '../scanner/RegisterUserToSession';

class Attendee extends React.Component{
    static navigationOptions={
        tabLabel: 'Attendee'
    }
    constructor(props) {
        super(props);
        this.state = {
            Attendees: [],
            isLoaded: false,
            isOffline: false,
            noDataFlag : false,
            count:0,
            searchString: ''
        }
    }
    updateSearch = search => {
        this.setState({ search });
      };
    componentWillMount() {
        if (Platform.OS !== 'ios') {
            NetInfo.isConnected.fetch().then(isConnected => {
                if (isConnected) {
                    this.getAttendeeList();
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
        this.getAttendeeList();
        NetInfo.addEventListener(
            'connectionChange',
            this.handleFirstConnectivityChange
        );
    }
    handleFirstConnectivityChange = (connectionInfo) => {
        if (connectionInfo.type != 'none') {
            this.getAttendeeList();
        } else {
            this.setState({
                isOffline: true
            });
        }
        this.setState({
            isOffline: connectionInfo.type === 'none',
        });
    };
    getCount=()=>{
        let count=0;
        this.state.Attendees.forEach((attendee,index)=>{
            if(attendee.roleName===this.props.profile){
                count++;
            }
        })
        this.setState({...this.state,count:count});
    }

    componentWillUnmount() {
        NetInfo.removeEventListener(
            'connectionChange',
            this.handleFirstConnectivityChange
        );
    }
 
    getAttendeeList() {
        let thisRef = this;
        let sponserCollection = [];
        eventService.getCurrentEvent((eventInfo)=>{
        if(eventInfo){
        let eventId = eventInfo._id;
        sponsorService.getAttendeeInfo(eventId).then((response)=>{
        if(response.length === 0){
        this.setState({
         isLoaded: true,
        noDataFlag : true
        })  
         }
         else{ 
            this.setState({
            Attendees: response,
            isLoaded: true,
            noDataFlag : false
          })
         }
         this.getCount()
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

     searchAttendee=(searchString)=>{
        this.setState({...this.state,searchString:searchString});
     }

    displayAttendees = () => {
        return this.state.Attendees.map((attendee, index) => {
            if(this.state.searchString.length!=0){
                if(attendee.roleName===this.props.profile)
                {
                    if(attendee.firstName.toLowerCase().includes(this.state.searchString.toLowerCase()) || attendee.lastName.toLowerCase().includes(this.state.searchString.toLowerCase())){ 
                let avatar;
                if (attendee.profileImageURL) {
                    avatar = <Image style={{ width: 60, height: 60,borderRadius:100 }} source={{ uri: attendee.profileImageURL }} />
                } else {
                    avatar = <Image style={{ width: 60, height: 60,borderRadius:100 }} source={require('../../assets/images/defaultSponsorImg.png')} />
                } 
                return (
                    <TouchableOpacity key={attendee._id} onPress={() => this.props.navigation.navigate('AttendeeProfileDetails',{ attendeeDetails: attendee})}
                    >
                        <RkCard rkType='shadowed' style={[styles.card]}>
                            <View style={{elevation:3, flexDirection: 'row' }}>
                                <View style={{ flexDirection: 'column', alignItems: 'flex-start', marginVertical: 10, flex: 3, alignSelf: 'center', marginLeft: 10 }}>
                                    {avatar}
                                </View>
                                <View style={{ flexDirection: 'column', alignItems: 'flex-start', marginVertical: 10, flex: 6, marginLeft: -10 }}>
                                    <Text style={styles.headerText}>{attendee.firstName+' '+attendee.lastName}</Text>
                                    <Text style={styles.infoText}>{attendee.briefInfo}</Text>
                                </View >
                            </View >
                        </RkCard>
                    </TouchableOpacity>
                ) 
            }
        }
        }else{
            if(attendee.roleName===this.props.profile)
            { 
            let avatar;
            if (attendee.profileImageURL) {
                avatar = <Image style={{ width: 60, height: 60  }} source={{ uri: attendee.profileImageURL }} />
            } else {
                avatar = <Image style={{ width: 60, height: 60  }} source={require('../../assets/images/defaultSponsorImg.png')} />
            } 
            return (
                <TouchableOpacity key={attendee._id} onPress={() => this.props.navigation.navigate('AttendeeProfileDetails',{ attendeeDetails: attendee})}
                >
                    <RkCard rkType='shadowed' style={[styles.card]}>
                        <View style={{ flexDirection: 'row',elevation:3 }}>
                            <View style={{ flexDirection: 'column', alignItems: 'flex-start', marginVertical: 10, flex: 3, alignSelf: 'center', marginLeft: 10 }}>
                                {avatar}
                            </View>
                            <View style={{ flexDirection: 'column', alignItems: 'flex-start', marginVertical: 10, flex: 6, marginLeft: -10 }}>
                                <Text style={styles.headerText}>{attendee.firstName+' '+attendee.lastName}</Text>
                                <Text style={styles.infoText}>{attendee.briefInfo}</Text>
                            </View >
                        </View >
                    </RkCard>
                </TouchableOpacity>
            )
        }
        }}); 
    }  
    render(){
        let attendeeList = this.displayAttendees();
        if (this.state.isLoaded && !this.state.noDataFlag && this.state.count!=0) {
            return (
                <Container style={[styles.root]}> 
                        

                    <ScrollView stickyHeaderIndices={[0]}>
                    <View style={styles.searchSection}>
                            {/* <Icon style={styles.searchIcon} name="ios-search" size={20} color="#000"/> */}
                            <TextInput
                                style={styles.input}
                                placeholder="Search here..."
                                onChangeText={(searchString) => {this.searchAttendee(searchString)}}
                                underlineColorAndroid="transparent"
                            />
                        </View>
                        <View>
                             {attendeeList} 
                        </View>
                    </ScrollView>
                 <View>
                  <Footer isOffline ={this.state.isOffline}/>    
                  </View>
                </Container>
            ) 
        }
        else if(this.state.isLoaded && !this.state.noDataFlag && this.state.count==0){
            return (    <EmptyData isOffline ={this.state.isOffline}/>)
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
        backgroundColor: '#f2f2f2'
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
    },
    searchSection: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 25,
    borderColor:'#ff3333',
    marginTop:3
    },
    searchIcon: {
        padding: 10,
    },
    input: {
        flex: 1,
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        backgroundColor: '#fff',
        color: '#424242',
        borderRadius: 25,


    },
}));
export default Attendee;