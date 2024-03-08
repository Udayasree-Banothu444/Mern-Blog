// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  // apiKey: process.env.VITE_FIREBASE_API_KEY,
  //as we are using VITE instead of create react app we need to write it as
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-6a807.firebaseapp.com",
  projectId: "mern-blog-6a807",
  storageBucket: "mern-blog-6a807.appspot.com",
  messagingSenderId: "876129934084",
  appId: "1:876129934084:web:5c25d2092354aea31d0e51",
  measurementId: "G-HQPT5ST44S"
};

// Initialize Firebase
 export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);