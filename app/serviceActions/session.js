import axios from 'axios';
import AppConfig from "../constants/AppConfig";
 
  //for eventCal 
   export const getSessionsByEventDate = (eventId, currentDate) =>{
      let promise = new Promise((resolve, reject) => {
         axios.get(`${AppConfig.serverURL}/api/session/getSessions/${eventId}`)
         .then(response => {
         let responseData = response.data;
         let sessionList = [];
         let selectedDate = new Date(currentDate.toDate()).setHours(0, 0, 0, 0);
         let nextDate = new Date(currentDate.add(1, 'day').toDate()).setHours(0, 0, 0, 0);
         responseData.forEach((data)=>{
         let startDate = new Date(data.startTime).setHours(0, 0, 0, 0);
         if((startDate === selectedDate)){
          sessionList.push(data)
         }
        })
         resolve(sessionList);
         })
         .catch(error => {
            reject(error);
         })
      })
        return promise;
     }

  //for speaker sessionList
   export const getSessionsByEvent = (eventId) =>{
      let promise = new Promise((resolve, reject) => {
         axios.get(`${AppConfig.serverURL}/api/session/getSessions/${eventId}`)
         .then(response => {
         resolve(response.data);
         })
         .catch(error => {
            reject(error);
         })
      })
        return promise;
     }