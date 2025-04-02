import admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: Bun.env.FIREBASE_API_KEY,
    authDomain: Bun.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: Bun.env.FIREBASE_DATABASE_URL,
    projectId: Bun.env.FIREBASE_PROJECT_ID,
    storageBucket: Bun.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: Bun.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: Bun.env.FIREBASE_APP_ID,
    measurementId: Bun.env.FIREBASE_MEASUREMENT_ID,
};

const serviceAccount = {
    projectId: Bun.env.FIREBASE_PROJECT_ID,
    privateKey: Bun.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: Bun.env.FIREBASE_CLIENT_EMAIL,
} as ServiceAccount;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: Bun.env.FIREBASE_DATABASE_URL,
});


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const db2 = admin.firestore();
const auth = getAuth(app);
export { app, auth, db, db2 }