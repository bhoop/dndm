import * as firebase from "firebase/app";
import "firebase/firestore";

// Initialize Firebase
const fbapp = firebase.initializeApp({
  apiKey: "AIzaSyBuMVxptETY2Qx1QupE00iJ21Hkm1kp7jI",
  authDomain: "dndm-firebase.firebaseapp.com",
  databaseURL: "https://dndm-firebase.firebaseio.com",
  projectId: "dndm-firebase",
  storageBucket: "dndm-firebase.appspot.com",
  messagingSenderId: "74992787896",
  appId: "1:74992787896:web:d9a264eefbf22905"
});

export const db = firebase.firestore();

export default fbapp;
