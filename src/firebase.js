
// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyCX8nDvTRPiFh4KTUadLkn6W-MAFj6_if4",
//   authDomain: "calc-71b06.firebaseapp.com",
//   projectId: "calc-71b06",
//   storageBucket: "calc-71b06.appspot.com",
//   messagingSenderId: "61607625931",
//   appId: "1:61607625931:web:7ee4c8a9feae3f3caf874e"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore through Firebase
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
const firebaseApp = initializeApp({
  apiKey: 'AIzaSyCX8nDvTRPiFh4KTUadLkn6W-MAFj6_if4',
  authDomain: 'calc-71b06.firebaseapp.com',
  projectId: 'calc-71b06'
});

export const db = getFirestore();