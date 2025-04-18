// firebase-setup.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDht8QvipgHS9fWHsEbkSyVO-72s4StTpo",
  authDomain: "campussafetyreport-a014e.firebaseapp.com",
  projectId: "campussafetyreport-a014e",
  storageBucket: "campussafetyreport-a014e.firebasestorage.app",
  messagingSenderId: "356245823678",
  appId: "1:356245823678:web:3f51fc67b760fb597bfeef",
  measurementId: "G-N1T5V9DLGM"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc };