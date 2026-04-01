// ================================================================
// DATA LAYER — Firestore reads / writes + seed data
// ================================================================

import { db } from './firebase-config.js';
import {
  collection, doc, getDoc, getDocs, setDoc, addDoc,
  updateDoc, deleteDoc, orderBy, query, serverTimestamp, writeBatch
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


export async function seedAnalysesManquantes() {
  const texteIds = ["f-t2", "f-t3", "r-t1", "r-t2"];
  let total = 0;
  for (const texteId of texteIds) {
    const mouvements = SEED.analyses[texteId] || [];
    for (const mvt of mouvements) {
      const { procedes, ...mvtData } = mvt;
      await setDoc(doc(db, 'mouvements', mvt.id), { ...mvtData, texteId, createdAt: serverTimestamp() });
      for (let i = 0; i < procedes.length; i++) {
        await setDoc(doc(db, 'procedes', procedes[i].id), { ...procedes[i], mouvementId: mvt.id, texteId, order: i, createdAt: serverTimestamp() });
        total++;
      }
    }
  }
  console.log(`Analyses manquantes importées : ${total} procédés.`);
}

export async function seedIfEmpty() {
  const snap = await getDocs(collection(db, 'oeuvres'));
  const isNew = snap.empty;

  if (isNew) {
    // Première initialisation : oeuvres + analyses
    console.log('Initialisation de la base…');
    for (const oeuvre of SEED.oeuvres) {
      await setDoc(doc(db, 'oeuvres', oeuvre.id), { ...oeuvre, createdAt: serverTimestamp() });
    }
    for (const [texteId, mouvements] of Object.entries(SEED.analyses)) {
      for (const mvt of mouvements) {
        const { procedes, ...mvtData } = mvt;
        await setDoc(doc(db, 'mouvements', mvt.id), { ...mvtData, texteId, createdAt: serverTimestamp() });
        for (let i = 0; i < procedes.length; i++) {
          await setDoc(doc(db, 'procedes', procedes[i].id), { ...procedes[i], mouvementId: mvt.id, texteId, order: i, createdAt: serverTimestamp() });
        }
      }
    }
    console.log('Seed initial terminé !');
  }

  // Toujours : synchronise les textes depuis le code vers Firebase
  // Permet d'ajouter/corriger des textes sans vider la base
  for (const [oeuvreId, textes] of Object.entries(SEED.textes)) {
    for (const texte of textes) {
      await setDoc(doc(db, 'textes', texte.id), { ...texte, oeuvreId, updatedAt: serverTimestamp() });
    }
  }
  console.log('Textes synchronisés !');
}



export async function getOeuvres() {
  const snap = await getDocs(query(collection(db, 'oeuvres'), orderBy('order')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
export async function addOeuvre(data) {
  const id = 'oeuvre-' + Date.now();
  await setDoc(doc(db, 'oeuvres', id), { ...data, order: Date.now(), createdAt: serverTimestamp() });
  return id;
}
export async function updateOeuvre(id, data) {
  await updateDoc(doc(db, 'oeuvres', id), { ...data, updatedAt: serverTimestamp() });
}

// ---- Textes ----
export async function getTextesForOeuvre(oeuvreId) {
  const snap = await getDocs(query(collection(db, 'textes'), orderBy('order')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(t => t.oeuvreId === oeuvreId);
}
export async function getTexte(texteId) {
  const snap = await getDoc(doc(db, 'textes', texteId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}
export async function addTexte(oeuvreId, data) {
  const id = 'tx-' + Date.now();
  await setDoc(doc(db, 'textes', id), { ...data, oeuvreId, order: Date.now(), createdAt: serverTimestamp() });
  return id;
}
export async function updateTexte(id, data) {
  await updateDoc(doc(db, 'textes', id), { ...data, updatedAt: serverTimestamp() });
}

// ---- Mouvements ----
export async function getMouvementsForTexte(texteId) {
  const snap = await getDocs(query(collection(db, 'mouvements'), orderBy('mouvement')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(m => m.texteId === texteId);
}
export async function addMouvement(texteId, data) {
  const id = 'mvt-' + Date.now();
  await setDoc(doc(db, 'mouvements', id), { ...data, texteId, createdAt: serverTimestamp() });
  return id;
}
export async function updateMouvement(id, data) {
  await updateDoc(doc(db, 'mouvements', id), { ...data, updatedAt: serverTimestamp() });
}
export async function deleteMouvement(id) {
  await deleteDoc(doc(db, 'mouvements', id));
}

// ---- Procédés ----
export async function getProcedesForMouvement(mouvementId) {
  const snap = await getDocs(query(collection(db, 'procedes'), orderBy('order')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(p => p.mouvementId === mouvementId);
}
export async function addProcede(mouvementId, texteId, data) {
  return await addDoc(collection(db, 'procedes'), { ...data, mouvementId, texteId, order: Date.now(), createdAt: serverTimestamp() });
}
export async function updateProcede(id, data) {
  await updateDoc(doc(db, 'procedes', id), { ...data, updatedAt: serverTimestamp() });
}
export async function deleteProcede(id) {
  await deleteDoc(doc(db, 'procedes', id));
}
