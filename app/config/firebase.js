import * as firebase from 'firebase';
import 'firebase/firestore';

// firebase.initializeApp({
//     apiKey: 'AIzaSyDM4bfZawYFEvNsYlNyNZLEfTPSPsbtUkQ',
//     authDomain: 'tiecon-b3493.firebaseapp.com',
//     databaseURL: 'https://tiecon-b3493.firebaseio.com',
//     projectId: 'tiecon-b3493',
//     storageBucket: 'tiecon-b3493.appspot.com',
//     messagingSenderId: '489302991624'
// });

firebase.initializeApp({
    apiKey: "AIzaSyAmhu_J_9kRqDuQZox7ccZVNgnOA9fc4Gw",
    authDomain: "tie-con-management.firebaseapp.com",
    databaseURL: "https://tie-con-management.firebaseio.com",
    projectId: "tie-con-management",
    storageBucket: "tie-con-management.appspot.com",
    messagingSenderId: "852890830155"
});
export const firestoreDB = firebase.firestore();

export default firebase;