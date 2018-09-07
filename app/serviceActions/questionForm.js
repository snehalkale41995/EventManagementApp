import axios from 'axios';
import AppConfig from "../constants/AppConfig";
 
   export const getHomeQuestionForm = (eventId) =>{
      let promise = new Promise((resolve, reject) => {
         axios.get(`${AppConfig.serverURL}/api/questionForms/eventId/${eventId}`)
         .then(response => {
           resolve(response.data);
         })
         .catch(error => {
            reject(error);
         })
      })
        return promise;
     }

    export const  submitHomeQuestionForm = (formResponse) =>{
      let promise = new Promise((resolve, reject) => {
         axios.post(`${AppConfig.serverURL}/api/homeQueResponse`, formResponse)
         .then(response => {
           resolve(response.data);
         })
         .catch(error => {
            reject(error.response.data);
         })
      })
        return promise;
     }

    export const getHomeQuestionResponse = (eventId) =>{
      let promise = new Promise((resolve, reject) => {
         axios.get(`${AppConfig.serverURL}/api/homeQueResponse/eventId/${eventId}`)
         .then(response => {
           resolve(response.data);
         })
         .catch(error => {
            reject(error);
         })
      })
        return promise;
     }


