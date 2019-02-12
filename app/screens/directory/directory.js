import React from 'react';
import { ScrollView, Platform, Image, NetInfo} from 'react-native';
import { Text, View, Icon, Container, Label } from 'native-base';
import { StyleSheet, FlatList, TouchableOpacity, Keyboard, Alert, AsyncStorage, ActivityIndicator, Linking, Dimensions  } from 'react-native';
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
import {TabNavigator} from 'react-navigation';
import * as loginService from "../../serviceActions/login";
import * as regResponseService from "../../serviceActions/registrationResponse";
import Attendee from './attendee';
import Sponsors from './sponsers';
import {  Tab, TabHeading,Tabs } from "native-base";
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import { BackHandler } from 'react-native';

export class Directory extends RkComponent {
  static navigationOptions = {
    title:'Directory'.toUpperCase()
}
    constructor(props) {
        super(props);
        this.state = {
          sessionList: [],
          userId: "",
          eventId: "",
          isLoaded: false,
          
        };
      }
      handleBackPress=()=>{
          this.props.navigation.replace('HomeMenu');
          return true;        
      }
  componentWillMount(){
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

  }
  componentWillUnmount(){
    BackHandler.removeEventListener('hardwareBackPress',this.handleBackPress);
  }
      componentDidMount() {
        let compRef = this;
        loginService.getCurrentUser(userDetails => {
          eventService.getCurrentEvent(eventDetails => {
            this.setState({
              userId: userDetails._id,
              eventId: eventDetails._id
            });
         
          });
        });
      }
      fetchSessionList = (eventId, userId) => {
        regResponseService
          .getRegResponseByEventUser(eventId, userId)
          .then(response => {
            let sessions = [];
            response.forEach(data => {
             let session = data.session;
              sessions.push({
                key: session._id,
                sessionName: session.sessionName,
                event: session.event,
                speakers: session.speakers,
                volunteers: session.volunteers,
                room: session.room,
                description: session.description,
                sessionType: session.sessionType,
                sessionCapacity: session.sessionCapacity,
                startTime: session.startTime,
                endTime: session.endTime,
                isBreak: !!session.isBreak,
                isRegistrationRequired: !!session.isRegistrationRequired
              });
            });
          // AsyncStorage.setItem("myAgendaList", JSON.stringify(sessions))
          this.setState({sessionList : sessions, isLoaded : true})
          });
      };
    
render() { 
    let {eventId, userId} = this.state;
    return (
    //     <TabView
    //     scrollEnabled
    //     style={{
    //         width:600
    //     }}
    //     navigationState={this.state.tabState}
    //     renderScene={SceneMap({
    //       first: Attendee,
    //       second: Attendee,
    //       first: Attendee,
    //       second: Attendee,
    //       first: Attendee,
    //       second: Attendee, 
    //     })}
    //     onIndexChange={index => this.setState({ ...this.state.tabState,index:index })} 
        
    //   />
      <Tabs style={{ elevation: 3,width:400}} style={styles.tabContent}
        onChangeTab={() => {
         //this.fetchSessionList(eventId, userId);
         }}
      > 
        <Tab heading='Deligates' tabStyle={{backgroundColor : '#c0c0c0'}} activeTabStyle={{backgroundColor : '#c0c0c0'}} textStyle={{fontSize:11,color:'#000000'}} activeTextStyle={{fontSize:11,color:'#000000',fontWeight:'normal'}} 
          // heading={
          //   <TabHeading  style={{backgroundColor : '#fff',}} >
          //     <Text  style={[styles.textColor]} >Deligates</Text> 
          //   </TabHeading>
          // } style={styles.activeBorder} 
          >        
          <Attendee navigation={this.props.navigation} profile='Delegate'/> 
        </Tab>
        <Tab heading='Volunteer'  tabStyle={{backgroundColor : '#c0c0c0'}} activeTabStyle={{backgroundColor : '#c0c0c0'}} textStyle={{fontSize:11,color:'#000000'}} activeTextStyle={{fontSize:11,color:'#000000',fontWeight:'normal'}} >
         {/* heading={ */}
          {/* //   <TabHeading style={{backgroundColor : '#fff'}}>
          //     <Text  style={[styles.textColor]} >Volunteers</Text>
          //   </TabHeading>
          // } style={styles.activeBorder}> */}
          <Attendee navigation={this.props.navigation} profile='Volunteer'/> 
        </Tab>
        <Tab  heading='Charter Member' tabStyle={{backgroundColor : '#c0c0c0'}} activeTabStyle={{backgroundColor : '#c0c0c0'}} textStyle={{fontSize:11,color:'#000000'}} activeTextStyle={{fontSize:11,color:'#000000',fontWeight:'normal'}} >
          {/* heading={
            <TabHeading style={{backgroundColor : '#fff',minWidth:8}}>
              <Text  style={[styles.textColor]} >Charter Member</Text>
            </TabHeading>
          } style={styles.activeBorder}> */}
          <Attendee  navigation={this.props.navigation}  profile='Charter Member'/> 
        </Tab> 
        <Tab  heading='Eco System Partner' tabStyle={{backgroundColor : '#c0c0c0'}} activeTabStyle={{backgroundColor : '#c0c0c0'}}  textStyle={{fontSize:11,color:'#000000'}} activeTextStyle={{fontSize:11,color:'#000000',fontWeight:'normal'}} >
          {/* heading={
            <TabHeading style={{backgroundColor : '#fff',minWidth:10,padding:0}}>
              <Text navigation={this.props.navigation}  style={[styles.textColor]} >Eco System Partner</Text>
            </TabHeading>
          } style={styles.activeBorder}> */}
          <Attendee  navigation={this.props.navigation}  profile='Eco System Partner'/> 
        </Tab> 
        <Tab  heading='Exhibitor' tabStyle={{backgroundColor : '#c0c0c0'}} activeTabStyle={{backgroundColor : '#c0c0c0'}} textStyle={{fontSize:11,color:'#000000'}} activeTextStyle={{fontSize:11,color:'#000000',fontWeight:'normal'}} >
          {/* heading={
            <TabHeading style={{backgroundColor : '#fff'}}>
              <Text  style={[styles.textColor]} >Exhibitor</Text>
            </TabHeading>
          } style={styles.activeBorder}>  */}
          <Attendee  navigation={this.props.navigation}  profile='Exhibitor'/> 
        </Tab>
      </Tabs>
    );
  }
}
let styles = RkStyleSheet.create(theme => ({
    screen: {
      backgroundColor: theme.colors.screen.base
    },
    tabContent: {
      backgroundColor: '#FFFFFF',
    },
    textColor : {
      color: '#ed1b24',
      fontSize:11,
      fontWeight:'normal'
    },
    activeBorder:{
      borderColor: '#ed1b24', 
    }
  }));
// var Directory=TabNavigator({
//     Tab1:Sponsors,
//     Tab2:Attendee
    

// }); 

// Directory.navigationOptions={
//     title:'Tab example'
// }
// export default Directory;
// export class Directory extends RkComponent {
//     static navigationOptions = {
//         title: 'Directory'.toUpperCase()
//     }; 
//     constructor(props) {
//         super(props);
//         this.state = {
//             Sponsors: [],
//             isLoaded: false,
//             isOffline: false,
//             noDataFlag : false
//         }
//     }

//      componentWillMount() {
//         if (Platform.OS !== 'ios') {
//             NetInfo.isConnected.fetch().then(isConnected => {
//                 if (isConnected) {
//                     this.getSponsorsList();
//                 } else {
//                     this.setState({
//                         isOffline: true
//                     });
//                 }
//                 this.setState({
//                     isOffline: !isConnected
//                 });
//             });
//         }
        // this.getSponsorsList();
        // NetInfo.addEventListener(
        //     'connectionChange',
        //     this.handleFirstConnectivityChange
        // );
    // }

    // handleFirstConnectivityChange = (connectionInfo) => {
    //     if (connectionInfo.type != 'none') {
    //         this.getSponsorsList();
    //     } else {
    //         this.setState({
    //             isOffline: true
    //         });
    //     }
    //     this.setState({
    //         isOffline: connectionInfo.type === 'none',
    //     });
    // };

    // componentWillUnmount() {
    //     NetInfo.removeEventListener(
    //         'connectionChange',
    //         this.handleFirstConnectivityChange
    //     );
    // }

    // getSponsorsList() {
    //     let thisRef = this;
    //     let sponserCollection = [];
    //     eventService.getCurrentEvent((eventInfo)=>{
    //     if(eventInfo){
    //     let eventId = eventInfo._id;
    //     sponsorService.getSponsorInfo(eventId).then((response)=>{
    //     if(response.length === 0){
    //     this.setState({
    //      isLoaded: true,
    //     noDataFlag : true
    //     })  
    //      }
    //      else{     
    //         this.setState({
    //         Sponsors: response,
    //         isLoaded: true,
    //         noDataFlag : false
    //       })
    //      }
    //   }).catch((error)=>{
    //     this.setState({
    //          isLoaded: false,
    //          noDataFlag : true
    //     })
    //    })
    //    }
    // })
    // }
  
    //  displayWebsite(websiteURL){
    //  if(websiteURL){
    //   Linking.openURL(websiteURL); 
    //  }
    //   else return;
    //  }

    // displaySponsors = () => {
    //     return this.state.Sponsors.map((sponsor, index) => {
    //         let avatar;
    //         if (sponsor.imageURL) {
    //             avatar = <Image style={{ width: 60, height: 60 }} source={{ uri: sponsor.imageURL }} />
    //         } else {
    //             avatar = <Image style={{ width: 60, height: 60 }} source={require('../../assets/images/defaultSponsorImg.png')} />
    //         }
    //         return (
    //             <TouchableOpacity onPress={() => this.displayWebsite(sponsor.websiteURL)}>
    //                 <RkCard rkType='shadowed' style={[styles.card]}>
    //                     <View style={{ flexDirection: 'row' }}>
    //                         <View style={{ flexDirection: 'column', alignItems: 'flex-start', marginVertical: 10, flex: 3, alignSelf: 'center', marginLeft: 10 }}>
    //                             {avatar}
    //                         </View>
    //                         <View style={{ flexDirection: 'column', alignItems: 'flex-start', marginVertical: 10, flex: 6, marginLeft: -10 }}>
    //                             <Text style={styles.headerText}>{sponsor.category}</Text>
    //                             <Text style={styles.infoText}>{sponsor.name}</Text>
    //                         </View >
    //                     </View >
    //                 </RkCard>
    //             </TouchableOpacity>
    //         )
    //     });
    // }

//         render() {
//         let sponsorList = this.displaySponsors();
//         if (this.state.isLoaded && !this.state.noDataFlag) {
//             return (
//                 <Container style={[styles.root]}>
//                     <ScrollView>
//                         <View>
//                              {sponsorList} 
//                         </View>
//                     </ScrollView>
//                  <View>
//                   <Footer isOffline ={this.state.isOffline}/>    
//                   </View>
//                 </Container>
//             ) 
//         }
//        else if(this.state.isLoaded && this.state.noDataFlag){
//         return (<EmptyData isOffline ={this.state.isOffline}/>)
//           }
//         else {
//             return (
//                <Container style={[styles.root]}>
//                     <Loader/> 
//                     <View>
//                     <Footer isOffline ={this.state.isOffline}/> 
//                     </View>
//                 </Container>
//             )
//         }
//     }
// }

// let styles = RkStyleSheet.create(theme => ({
//     root: {
//         backgroundColor: theme.colors.screen.base
//     },
//     card: {
//         margin: 1,
//         padding: 4
//     },
//     headerText: {
//         fontWeight: 'bold',
//         fontSize: 16
//     },
//     infoText: {
//         fontSize: 12
//     }
// }));