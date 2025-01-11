// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE,
  authDomain: "blog-page-6942.firebaseapp.com",
  projectId: "blog-page-6942",
  storageBucket: "blog-page-6942.appspot.com",
  messagingSenderId: "746079286052",
  appId: "1:746079286052:web:91d3b0535255651189f9b1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);