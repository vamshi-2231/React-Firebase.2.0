import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_KEY,
    authDomain: "project-35961.firebaseapp.com",
    databaseURL: "https://project-35961-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "project-35961",
    storageBucket: "project-35961.appspot.com",
    messagingSenderId: "484826702351",
    appId: "1:484826702351:web:1e6932e1db2358446d797a"
  };

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
