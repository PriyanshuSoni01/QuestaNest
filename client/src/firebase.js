// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ,
  authDomain: "questanest-1e54a.firebaseapp.com",
  projectId: "questanest-1e54a",
  storageBucket: "questanest-1e54a.appspot.com",
  messagingSenderId: "1013535204391",
  appId: "1:1013535204391:web:3cce30585645d2d871da02"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);