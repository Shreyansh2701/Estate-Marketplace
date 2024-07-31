// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-cc30a.firebaseapp.com",
  projectId: "mern-estate-cc30a",
  storageBucket: "mern-estate-cc30a.appspot.com",
  messagingSenderId: "854927351814",
  appId: "1:854927351814:web:62b8b8aaab3fe84b7ea387"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);