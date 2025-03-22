import admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';

const serviceAccount = {
    projectId: Bun.env.FIREBASE_PROJECT_ID,
    privateKey: Bun.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: Bun.env.FIREBASE_CLIENT_EMAIL,
} as ServiceAccount;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: Bun.env.FIREBASE_DATABASE_URL,
});

const db = admin.firestore();

export { db, admin };