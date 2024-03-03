// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";



// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB8FMp8MVmfGRi1teRJ-ui3REwQp3_nsbQ",
  authDomain: "itpm-db0f6.firebaseapp.com",
  projectId: "itpm-db0f6",
  storageBucket: "itpm-db0f6.appspot.com",
  messagingSenderId: "154225730046",
  appId: "1:154225730046:web:783f325f184df2803ae0af"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth()
export const storage = getStorage(app);

////-----------------------
