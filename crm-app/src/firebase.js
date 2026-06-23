// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQ4jYOiAPjyy8WfIGrcVHZzTCzc51Ax1E",
  authDomain: "chat-afe37.firebaseapp.com",
  projectId: "chat-afe37",
  storageBucket: "chat-afe37.firebasestorage.app",
  messagingSenderId: "317841569563",
  appId: "1:317841569563:web:0e8d6b9b54ac23fa0d85be",
  measurementId: "G-ML26EVBL2Y",
  databaseURL: "https://chat-afe37-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const db = getFirestore(app);
const rtdb = getDatabase(app);

// Indicate that Firebase is active and configured
const isFirebaseConfigured = true;

export { db, rtdb, isFirebaseConfigured };