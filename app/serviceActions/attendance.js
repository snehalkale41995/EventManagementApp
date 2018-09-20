import axios from "axios";
import AppConfig from "../constants/AppConfig";

//markAttendance
export const markAttendance = (attendanceObj) =>{
      let promise = new Promise((resolve, reject) => {
         axios.post(`${AppConfig.serverURL}/api/attendance`,attendanceObj)
         .then(response => {
           resolve(response.data);
         })
         .catch(error => {
            reject(error.response.data);
         })
      })
        return promise;
     }

//Qrscanner subscribeToSessionUpdate
export const getUserCount = (eventId, sessionId) => {
  console.warn("sessionId",sessionId);
  let promise = new Promise((resolve, reject) => {
    axios
      .get(
        `${AppConfig.serverURL}/api/attendance/bySessionEvent/${eventId}/${sessionId}`
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