import axios from 'axios';
import AppConfig from "../constants/AppConfig";

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


    /////////// In component
    //    eventServices.getData().then(function(response) {
    //      console.log("Success!", response);
    //     }, function(error) {
    //      console.error("Failed!", error);
    //     })



