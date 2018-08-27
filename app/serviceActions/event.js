import axios from 'axios';
import AppConfig from "../constants/AppConfig";
import {AsyncStorage} from 'react-native';

  export const  getEvents = () =>{
      let promise = new Promise((resolve, reject) => {
         axios.get(`${AppConfig.serverURL}/api/event`)
         .then(response => {
           resolve(response.data);
         })
         .catch(error => {
            reject(error);
         })
      })
        return promise;
     }
  
   export const  getEventById = (eventId) =>{
      let promise = new Promise((resolve, reject) => {
         axios.get(`${AppConfig.serverURL}/api/event/${eventId}`)
         .then(response => {
           resolve(response.data);
         })
         .catch(error => {
            reject(error);
         })
      })
        return promise;
     }


      export const getCurrentEvent = (successFn, errorFn)=>{
        AsyncStorage.getItem("EVENT_DETAILS").then((eventDetails)=>{
            successFn(JSON.parse(eventDetails));
            }).catch(err => {
                console.warn('Errors');
                if(errorFn){
                    errorFn(err);
                }
                
        });
    }


