import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database"; 

const firebaseConfig = {
  apiKey: "AIzaSyC4Ewg_vdodbdA5DKiwkN1mfzrygC5S9HM",
  authDomain: "majorproject-74f7e.firebaseapp.com",
  databaseURL: "https://majorproject-74f7e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "majorproject-74f7e",
  storageBucket: "majorproject-74f7e.firebasestorage.app",
  messagingSenderId: "1055106954019",
  appId: "1:1055106954019:web:964db6840e686962c15296",
  measurementId: "G-MJKZQLLGSF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
const analytics = getAnalytics(app);