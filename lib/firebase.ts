import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDUmMtGnKpaX0oZ13P6o7kI6gLHUb_Xrbs",
  authDomain: "tourvista-20d1e.firebaseapp.com",
  projectId: "tourvista-20d1e",
  storageBucket: "tourvista-20d1e.firebasestorage.app",
  messagingSenderId: "256274676540",
  appId: "1:256274676540:web:05cce5c2dfcd2db930bc39",
  measurementId: "G-QFW4H2Y3BL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "version1");
