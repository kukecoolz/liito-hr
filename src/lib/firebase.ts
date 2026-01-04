import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDppu9sHxCtkT6d2f_qSYRI3S_sTvKaOUk",
    authDomain: "litto-hr.firebaseapp.com",
    projectId: "litto-hr",
    storageBucket: "litto-hr.firebasestorage.app",
    messagingSenderId: "208999626046",
    appId: "1:208999626046:web:d0371f92cd9f8f330f686f",
    measurementId: "G-7G8TDX20RV"
};

// Initialize Firebase (singleton pattern for Next.js)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Auth initialization
const auth = getAuth(app);

// Analytics initialization (Client-only)
let analytics: any;
if (typeof window !== 'undefined') {
    isSupported().then((supported) => {
        if (supported) {
            analytics = getAnalytics(app);
        }
    });
}

export { app, auth, analytics };
