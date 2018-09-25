import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {Agenda} from 'react-native-calendars';
import Moment from 'moment';
import ScheduleTile from './Schedule-tile';
import styleConstructor from './styles';
import * as sessionService from '../../../serviceActions/session';
import * as eventService from '../../../serviceActions/event';
export default class EventCal extends Component {
    constructor(props) {
        super(props);
      
        this.styles = styleConstructor();
        this.state =  {
            sessions: {},
            eventDetails: {},
            isLoaded : false,
            eventStartDate : "",
            eventEndDate : ""
        };
    }
 
    componentDidMount(){
     eventService.getCurrentEvent((eventDetails)=>{
      const __startDate = Moment(eventDetails.startDate).format("YYYY-MM-DD");
      const __endDate  =  Moment(eventDetails.endDate).format("YYYY-MM-DD");
       this.setState({
        eventDetails : eventDetails,
        eventStartDate : __startDate,
        eventEndDate :__endDate,
        isLoaded : true
      })
     })
    }
    /**
     * Extract Session data from snapshot object
     */
    extractSession = (sessionObj) => {
        const {
           sessionName,
           event,
           speakers,
           volunteers,
           room,
           description,
           sessionType,
           sessionCapacity,
           startTime,
           endTime,
           isBreak,
           isRegistrationRequired
        } = sessionObj;
        return {
            key: sessionObj._id,
            sessionName,
            event,
            speakers,
            volunteers,
            room,
            description,
            sessionType,
            sessionCapacity,
            startTime,
            endTime,
            isBreak :!!isBreak,
            isRegistrationRequired:!!isRegistrationRequired
        }
    }
    
    /**
     * Database Query for Fetching Sessions
     */
    fetchSessions = (currentDate, displayDate, successFn) => {
        let eventId = this.state.eventDetails._id;
        sessionService.getSessionsByEventDate(eventId, currentDate).then(successFn)
        .catch(err =>{
            console.warn(err);
        });
    }
  
  
    /**
     * Hide date displayed on left side of panel
     */
    renderDay = (day, item) => {
        return (<View/>)
    }
    
    /**
     * Fetch Sessions for selected date
     */

    loadSessions = (selectedDay) => {
      
         let currentDate;
         let displayDate;
         let startDate = this.state.eventDetails.startDate;
         let startDay =  Moment(startDate).format("DD");
         
        // This hardcoding Can be removed after below bug fix in react-native-calendars library
        // [https://github.com/wix/react-native-calendars/issues/24] 
        if(selectedDay.dateString == '2018-03-20'){
            return;
        }
         if(startDay === selectedDay.day.toString()){
         currentDate = Moment(this.state.eventStartDate.toString());
         displayDate = this.state.eventStartDate
        }
        else{
         currentDate = Moment(selectedDay.dateString);
         displayDate = selectedDay.dateString;
        }

         // Dynamically fetch Event start and end dates
        let index = 0;
        this.fetchSessions(currentDate, displayDate, (sessionList) => {
            var sessions = [];
            let allSpeakers = [];
            let index = 0;
            sessionList.forEach((sessionObj) => {
                let __sessionObj = this.extractSession(sessionObj);
                sessions.push(__sessionObj);
            });
            let newSessions = {};
            newSessions[displayDate] = sessions;
            this.setState((prevState) => ({
                ...prevState,
                sessions: newSessions
            }));
        });
    }
    
    /**
     * Session Rendering
     */
    renderSession = (item) => {
        return (<ScheduleTile
            navigation={this.props.navigation}
            session={item}
            eventId={this.state.eventDetails._id}/>);
    }
    /**
     * Handle Session Rendering
     * when no event is present on selected date
     */
    renderEmptyDate = (day) => {
        return (
            <View style={this.styles.emptyDate}>
                <Text>No sessions for this date</Text>
            </View>
        );
    }
    
    /**
     */
    rowHasChanged = (r1, r2) => {
        return r1.name !== r2.name;
    }
 
    /**
     * Render method for component
     */
    render() {
        if(this.state.isLoaded){
            let __startDate = this.state.eventStartDate;
            let __endDate = this.state.eventEndDate;
            return (<Agenda
            items={this.state.sessions}
            hideKnob={true}
            loadItemsForMonth={this.loadSessions}
            selected={__startDate.toString()}
            renderItem={this.renderSession}
            renderEmptyDate={this.renderEmptyDate}
            rowHasChanged={this.rowHasChanged}
            minDate={__startDate}
            maxDate={__endDate}
            firstDay={3}
            monthFormat={'yyyy'}
            theme={{
                backgroundColor: '#ffffff',
                calendarBackground: '#F0F0F0',
                textSectionTitleColor: '#b6c1cd',
                selectedDayBackgroundColor: '#E7060E',
                selectedDayTextColor: '#FFFFFF',
                todayTextColor: '#00adf5',
                dayTextColor: '#2d4150',
                textDisabledColor: '#CFCFCF',
                dotColor: '#FFFFFF',
                selectedDotColor: '#E7060E',
                monthTextColor: '#E7060E'
            }}
            renderDay={this.renderDay}/>);
        }
       else{
           return(
             <View><Text>loading..... </Text></View>  
           )
       }
   
    }
}