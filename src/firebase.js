// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDUangnygODtJNfDuKP1P0_iMg_mVLCEV8",
    authDomain: "tarim-web.firebaseapp.com",
    projectId: "tarim-web",
    storageBucket: "tarim-web.firebasestorage.app",
    messagingSenderId: "221281685696",
    appId: "1:221281685696:web:2c9a7a466ff9744e4ddd25",
    measurementId: "G-JSQDNP8Q79"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { auth };

export { app, analytics, db };