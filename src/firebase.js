
// Initialize Cloud Firestore through Firebase
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
const firebaseApp = initializeApp({
  apiKey: 'AIzaSyCX8nDvTRPiFh4KTUadLkn6W-MAFj6_if4',
  authDomain: 'calc-71b06.firebaseapp.com',
  projectId: 'calc-71b06'
});

export const db = getFirestore();