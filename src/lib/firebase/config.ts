import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase only if the API key is present
const app = (firebaseConfig.apiKey && getApps().length === 0)
    ? initializeApp(firebaseConfig)
    : (getApps().length > 0 ? getApp() : null);

// Provide fallback values if app is null
const auth = app ? getAuth(app) : null as any;
const db = app ? getFirestore(app) : null as any;
const storage = app ? getStorage(app) : null as any;

export { app, auth, db, storage };
