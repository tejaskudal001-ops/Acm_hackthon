import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCjfyhxXvxsTGuCcH0wMi_-fCvlO8nqVdc",
  authDomain: "tripgenie-a2484.firebaseapp.com",
  projectId: "tripgenie-a2484",
  storageBucket: "tripgenie-a2484.firebasestorage.app",
  messagingSenderId: "635127644978",
  appId: "1:635127644978:web:475cd98992c76bee7f8d2b",
  measurementId: "G-K1EWYSXEX6",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let analytics = null;

if (typeof window !== "undefined") {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {
      analytics = null;
    });
}

export { app, auth, db, analytics };
