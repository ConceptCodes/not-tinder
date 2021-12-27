/* Import the firebase SDK and extend with firestore */
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

firebase.initializeApp({
    apiKey: process.env.VUE_APP_API_KEY,
    authDomain: process.env.VUE_APP_AUTH_DOMAIN,
    projectId: process.env.VUE_APP_PROJECT_ID,
    storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.VUE_APP_MESSAGING_SENDER_ID,
    appId: process.env.VUE_APP_APP_ID
});

export const currentTime = firebase.firestore.Timestamp.fromDate(new Date());
export const db = firebase.firestore()
export const auth = firebase.auth()
export const arrayUnion = firebase.firestore.FieldValue.arrayUnion();
