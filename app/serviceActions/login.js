import axios from 'axios';
import AppConfig from "../constants/AppConfig";
import {AsyncStorage} from 'react-native';

  export const  loginUser = (user) =>{
      let promise = new Promise((resolve, reject) => {
         axios.post(`${AppConfig.serverURL}/api/authenticate/appAuth`, user)
         .then(response => {
           resolve(response.data);
         })
         .catch(error => {
            reject(error.response.data);
         })
      })
        return promise;
     }

    export const getCurrentUser = (successFn, errorFn)=>{
        AsyncStorage.getItem("USER_DETAILS").then((userDetails)=>{
                successFn(JSON.parse(userDetails));
            }).catch(err => {
                // console.warn('Errors');
                if(errorFn){
                    errorFn(err);
                }
        });
    }

  export const  getUserDetails = (id) =>{
      let promise = new Promise((resolve, reject) => {
         axios.get(`${AppConfig.serverURL}/api/attendee/${id}`)
         .then(response => {
           resolve(response.data);
         })
         .catch(error => {
            reject(error.response.data);
         })
      })
        return promise;
     }
  
     export const  getSpeakerDetails = (id) =>{
      let promise = new Promise((resolve, reject) => {
         axios.get(`${AppConfig.serverURL}/api/speaker/${id}`)
         .then(response => {
           resolve(response.data);
         })
         .catch(error => {
            reject(error.response.data);
         })
      })
        return promise;
     }

    _storeData = async (data) => {
        try {
          await AsyncStorage.setItem('USER_DETAILS', data);

        } catch (error) {
          // console.log(error);
        }
      };