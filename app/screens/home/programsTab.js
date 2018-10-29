import React from 'react';
import { RkAvoidKeyboard, RkStyleSheet } from 'react-native-ui-kitten';
import { Tabs, Tab, Icon, Text, TabHeading } from "native-base";
import {Platform, AsyncStorage} from 'react-native';
import MyAgenda from './schedule/MyAgenda';
import EventCal from './schedule/EventCal';
import * as loginService from "../../serviceActions/login";
import * as eventService from "../../serviceActions/event";
import * as regResponseService from "../../serviceActions/registrationResponse";
export class ProgramsTab extends React.Component {
   constructor(props) {
    super(props);
    this.state = {
      sessionList: [],
      userId: "",
      eventId: "",
      isLoaded: false
    };
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
      <Tabs style={{ elevation: 3 }} style={styles.tabContent}
        onChangeTab={() => {
         this.fetchSessionList(eventId, userId);
         }}
      >
        <Tab
          heading={
            <TabHeading  style={{backgroundColor : '#fff'}} >
              <Icon style={[styles.textColor]} name="calendar"/>
              <Text  style={[styles.textColor]} >Schedule</Text>
            </TabHeading>
          } style={styles.activeBorder}>        
          <EventCal navigation={this.props.navigation}/>
        </Tab>
        <Tab
          heading={
            <TabHeading style={{backgroundColor : '#fff'}}>
              <Icon  style={[styles.textColor]}  name="ios-link"/>
              <Text  style={[styles.textColor]} >My Agenda</Text>
            </TabHeading>
          } style={styles.activeBorder}
        
          >
          <MyAgenda navigation={this.props.navigation} isLoaded={this.state.isLoaded} myAgendaList={this.state.sessionList}/>
        </Tab>
      </Tabs>
    );
  }
}

let styles = RkStyleSheet.create(theme => ({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.screen.base
  },
  tabContent: {
    backgroundColor: '#FFFFFF',   
  },
  textColor : {
    color: '#ed1b24'
  },
  activeBorder:{
    borderColor: '#ed1b24',
  }
}));