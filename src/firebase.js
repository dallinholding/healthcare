import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const config = {
  apiKey: "AIzaSyAQM1QJBqJL1KYauGWxJQ4mHvx2TQtsQDE",
  authDomain: "healthcare-749ac.firebaseapp.com",
  databaseURL: "https://healthcare-749ac.firebaseio.com",
  projectId: "healthcare-749ac",
  storageBucket: "healthcare-749ac.appspot.com",
  messagingSenderId: "580869557806",
  appId: "1:580869557806:web:ed56482d2a5b4ebf0ed9bf"
};

firebase.initializeApp(config);

export const auth = firebase.auth();

export const db = firebase.firestore();
