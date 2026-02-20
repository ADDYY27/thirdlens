import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔥 REPLACE THESE WITH YOUR FIREBASE PROJECT CONFIG
// Go to: console.firebase.google.com → Your Project → Project Settings → Your Apps → Config
const firebaseConfig = {
  apiKey: "AIzaSyBrA0Dv5PCf9ndVGztp_6BrmILb_Llb36Y",
  authDomain: "third-lens-d732e.firebaseapp.com",
  projectId: "third-lens-d732e",
  storageBucket: "third-lens-d732e.firebasestorage.app",
  messagingSenderId: "1066862730329",
  appId: "1:1066862730329:web:284007c4e6604e9aaa2548",
  measurementId: "G-L42WBLQCWN"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
