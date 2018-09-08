import axios from 'axios';
import AppConfig from "../constants/AppConfig";
 
   export const getSessionsByEvent = (eventId) =>{
      let promise = new Promise((resolve, reject) => {
         axios.get(`${AppConfig.serverURL}/api/speaker/event/${eventId}`)
         .then(response => {
           resolve(response.data);
         })
         .catch(error => {
            reject(error);
         })
      })
        return promise;
     }