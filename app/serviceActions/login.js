import axios from 'axios';
import AppConfig from "../constants/AppConfig";
import {AsyncStorage} from 'react-native';

  export const  loginUser = (user) =>{
      let promise = new Promise((resolve, reject) => {
         axios.post(`${AppConfig.serverURL}/api/authenticate`, user)
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
                console.warn('Errors');
                if(errorFn){
                    errorFn(err);
                }
                
        });
    }
 