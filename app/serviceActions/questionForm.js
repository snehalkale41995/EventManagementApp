import axios from 'axios';
import AppConfig from "../constants/AppConfig";

//for all type of forms
   export const getQuestionForm = (eventId) =>{
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
     
// HomeQuestions
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

    // HomeQuestions
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

//FeedbackQuestions
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

//FeedbackQuestions
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

//SessionQuestionAnswer
 export const  submitSessionQuestions = (sessionQuestion) =>{
   console.log("sessionQuestion", sessionQuestion);
      let promise = new Promise((resolve, reject) => {
         axios.post(`${AppConfig.serverURL}/api/sessionQAnswer`, sessionQuestion)
         .then(response => {
           resolve(response.data);
         })
         .catch(error => {
            reject(error.response.data);
         })
      })
        return promise;
     }  

//SessionQuestion
  export const getSessionQuestions = (eventId, sessionId, orderRef) =>{
      let promise = new Promise((resolve, reject) => {
         axios.get(`${AppConfig.serverURL}/api/sessionQAnswer/${orderRef}/${eventId}/${sessionId}`)
         .then(response => {
           resolve(response.data);
         })
         .catch(error => {
            reject(error);
         })
      })
        return promise;
     }

// SessionQuestionAnswer update votes
    export const  updateSessionQuestion = (queId, formResponse) =>{
      let promise = new Promise((resolve, reject) => {
         axios.put(`${AppConfig.serverURL}/api/sessionQAnswer/${queId}`, formResponse)
         .then(response => {
           resolve(response.data);
         })
         .catch(error => {
            reject(error.response.data);
         })
      })
        return promise;
     }