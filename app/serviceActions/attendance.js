import axios from "axios";
import AppConfig from "../constants/AppConfig";
import Moment from 'moment';
//markAttendance
export const markAttendance = (attendanceObj) =>{
      let promise = new Promise((resolve, reject) => {
         axios.post(`${AppConfig.serverURL}/api/attendance`,attendanceObj)
         .then(response => {
           resolve(response.data);
         })
         .catch(error => {
            reject(error.response.data);
         })
      })
        return promise;
     }

//Qrscanner subscribeToSessionUpdate
export const getUserCount = (eventId, sessionId) => {
  let promise = new Promise((resolve, reject) => {
    axios
      .get(
        `${AppConfig.serverURL}/api/attendance/bySessionEvent/${eventId}/${sessionId}`
      )
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
  return promise;
};

//check already scanned
export const checkAlreadyScanned = (sessionId, userId) => {
  let promise = new Promise((resolve, reject) => {
    axios
      .get(
        `${AppConfig.serverURL}/api/attendance/bySessionUSer/${sessionId}/${userId}`
      )
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
  return promise;
};

//getAttendanceList
export const getAttendance = (selectedSession , eventId) => {
  let currentSessionStart = selectedSession.startTime;
  let currentSessionEnd = selectedSession.endTime;
  let attendanceList = [], i;
  let promise = new Promise((resolve, reject) => {
    axios
      .get(
        `${AppConfig.serverURL}/api/attendance/byEventId/${eventId}`
      )
      .then(response => {
        let attendance = response.data;
        if(attendance.length>0){
            for (i = 0; i < attendance.length; i++) {
            let regSession = attendance[i].session;
            let isSameStart = Moment(currentSessionStart).isSame(Moment(regSession.startTime));
            let isSameEnd = Moment(currentSessionEnd).isSame(Moment(regSession.endTime));
            let isBetweenStart =  Moment(currentSessionStart).isBetween(Moment(regSession.startTime),Moment(regSession.endTime));
            let isBetweenEnd = Moment(currentSessionEnd).isBetween(Moment(regSession.startTime),Moment(regSession.endTime));
            let isBetweenStartOld = Moment(regSession.startTime).isBetween(Moment(currentSessionStart),Moment(currentSessionEnd));
            let isBetweenEndOld = Moment(regSession.endTime).isBetween(Moment(currentSessionStart),Moment(currentSessionEnd));
           let alreadyReg = isSameStart || isSameEnd || isBetweenStart ||isBetweenEnd||isBetweenStartOld ||isBetweenEndOld;
           if(alreadyReg && regSession._id !== selectedSession._id) {
              let userId = attendance[i].userId;
              attendanceList.push(userId);
           }
         };
        }
          resolve(attendanceList);
        })
      .catch(error => {
        reject(error);
      });
  });
  return promise;
};