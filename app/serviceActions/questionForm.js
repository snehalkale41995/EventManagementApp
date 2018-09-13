import axios from 'axios';
import AppConfig from "../constants/AppConfig";
 
//for all type of forms
   export const getQuestionForm = (eventId) =>{
      let promise = new Promise((resolve, reject) => {
         axios.get(`${AppConfig.serverURL}/api/questionForms/eventId/${eventId}`)
         .then(response => {
           console.log("response.data", response.data)
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


 export const  submitFeedbackForm = (formResponse) =>{
      let promise = new Promise((resolve, reject) => {
         axios.post(`${AppConfig.serverURL}/api/sessionFeedback`, formResponse)
         .then(response => {
           resolve(response.data);
         })
         .catch(error => {
            reject(error.response.data);
         })
      })
        return promise;
     }

    export const getFeedbackResponse = (eventId, sessionId,userId) =>{
      let promise = new Promise((resolve, reject) => {
         axios.get(`${AppConfig.serverURL}/api/sessionFeedback/bySessionUser/${eventId}/${sessionId}/${userId}`)
         .then(response => {
           resolve(response.data);
         })
         .catch(error => {
            reject(error);
         })
      })
        return promise;
     }