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
  apiKey: "REMPLACE-PAR-TA-CLE",
  authDomain: "TON-PROJET.firebaseapp.com",
  projectId: "TON-PROJET-ID",
  storageBucket: "TON-PROJET.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
