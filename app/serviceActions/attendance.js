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