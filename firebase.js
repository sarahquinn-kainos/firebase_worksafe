import firebase from 'firebase';
import { initializeApp } from 'firebase/app';
import "firebase/auth"
import "firebase/firestore"

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD9jFkl1hlkiICQFyBX8hrQnRudTIxzY2w",
  authDomain: "com667-7973b.firebaseapp.com",
  projectId: "com667-7973b",
  storageBucket: "com667-7973b.appspot.com",
  messagingSenderId: "760562001764",
  appId: "1:760562001764:web:2f040645bf3253ea06bc71",
  measurementId: "G-LT03W4K01Q"
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app()
}

const auth = firebase.auth()
const firestore = firebase.firestore()
export { auth, firestore, firebase };
