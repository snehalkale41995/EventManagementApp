import axios from "axios";
import AppConfig from "../constants/AppConfig";

export const getRegResponse = () => {
  let promise = new Promise((resolve, reject) => {
    axios
      .get(
        `${AppConfig.serverURL}/api/registrationResponse`
      )
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
  return promise;
};

//checkAlreadyRegistered
export const getRegResponseByEventUser = (eventId, userId) => {
  let promise = new Promise((resolve, reject) => {
    axios
      .get(
        `${AppConfig.serverURL}/api/registrationResponse/byUser/${eventId}/${userId}`
      )
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
  return promise;
};

//fetchRegistrationStatus
export const getRegResponseBySessionUser = (eventId, sessionId, userId) => {
  let promise = new Promise((resolve, reject) => {
    axios
      .get(
        `${AppConfig.serverURL}/api/registrationResponse/bySessionUser/${eventId}/${sessionId}/${userId}`
      )
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
  return promise;
};

//onCancelRequest
export const deleteRegResonse = regId => {
  let promise = new Promise((resolve, reject) => {
    axios
      .delete(`${AppConfig.serverURL}/api/registrationResponse/${regId}`)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
  return promise;
};

//onAttendRequest
export const  addRegResponse = (attendRequest) =>{
      let promise = new Promise((resolve, reject) => {
         axios.post(`${AppConfig.serverURL}/api/registrationResponse`,attendRequest)
         .then(response => {
       
           resolve(response.data);
         })
         .catch(error => {
     
            reject(error.response.data);
         })
      })
        return promise;
     }

//Qrscanner  _getCurrentSessionUsers
export const getRegResponseByEventSession = (eventId, sessionId) => {
  let promise = new Promise((resolve, reject) => {
    axios
      .get(
        `${AppConfig.serverURL}/api/registrationResponse/byEventSession/${eventId}/${sessionId}`
      )
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
  return promise;
};
