import axios from 'axios';
import AppConfig from "../constants/AppConfig";

  export const  getData = () =>{
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



    /////////// In component
    //    eventServices.getData().then(function(response) {
    //      console.log("Success!", response);
    //     }, function(error) {
    //      console.error("Failed!", error);
    //     })













function getEvents(url) {
  return new Promise(function(resolve, reject) {

       axios
      .get(`${AppConfig.serverURL}/api/event`)
      .then(response => {
      })
      .catch(error => {
        dispatch(getEventsFail(error));
      });

    var req = new XMLHttpRequest();
    req.open('GET', url);
    req.onload = function() {
      // This is called even on 404 etc
      // so check the status
      if (req.status == 200) {
        // Resolve the promise with the response text
        resolve(req.response);
      }
      else {
        // Otherwise reject with the status text
        // which will hopefully be a meaningful error
        reject(Error(req.statusText));
      }
    };

    // Handle network errors
    req.onerror = function() {
      reject(Error("Network Error"));
    };

    // Make the request
    req.send();
  });
}