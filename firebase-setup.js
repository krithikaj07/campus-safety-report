// firebase-setup.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, doc, getDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";


const firebaseConfig = {
  apiKey: "AIzaSyD7xNCBjZHVgCO9RW-Bk9DghVS7UXLkzuY",
  authDomain: "lifesafe-8c188.firebaseapp.com",
  projectId: "lifesafe-8c188",
  storageBucket: "lifesafe-8c188.firebasestorage.app",
  messagingSenderId: "388999461320",
  appId: "1:388999461320:web:5c33485e2b18d5c66c68fd",
  measurementId: "G-L2ZPG16XDG"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


export { app, db, collection, addDoc, onSnapshot, query, orderBy, doc, getDoc, getDocs, auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged };