// ================================================================
// FIREBASE CONFIG
// ================================================================
// 1. Va sur https://console.firebase.google.com
// 2. Crée un projet (ex: "analyses-bac")
// 3. Ajoute une "Web app"
// 4. Copie la config ici (les valeurs entre guillemets)
// 5. Active Firestore dans "Build > Firestore Database" (mode test)
// ================================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB601UUt1uwcL6DNBZbLtq_qwdJmW78n4o",
  authDomain: "analyse-lineaire.firebaseapp.com",
  databaseURL: "https://analyse-lineaire-default-rtdb.firebaseio.com",
  projectId: "analyse-lineaire",
  storageBucket: "analyse-lineaire.firebasestorage.app",
  messagingSenderId: "711443558146",
  appId: "1:711443558146:web:e1bd5ff08b59129c379c1b"
}; // <-- L'accolade fermante a été ajoutée ici
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
