// src/firebaseConfig.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBMMbE-WD1OAAw_gvtW97YwMG1tH7qxbeM",
  authDomain: "keia-fa694.firebaseapp.com",
  projectId: "keia-fa694",
  storageBucket: "keia-fa694.appspot.com",
  messagingSenderId: "865150753562",
  appId: "1:865150753562:web:c1829e2ea2927dc2006aa3",
  measurementId: "G-2YZ29HHJ1Z"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// usar getAuth simple (funciona bien en Expo managed JS)
export const auth = getAuth(app);
export const db = getFirestore(app);
