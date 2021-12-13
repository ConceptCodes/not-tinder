/* Import the firebase SDK and extend with firestore */
import firebase from 'firebase';
require('firebase/firestore');

firebase.initializeApp({
    apiKey: "AIzaSyAdBUWBWab68z8Eo0ldaaFzfD9LEvGtkcQ",
    authDomain: "insider-stall.firebaseapp.com",
    projectId: "insider-stall",
    storageBucket: "insider-stall.appspot.com",
    messagingSenderId: "426981076390",
    appId: "1:426981076390:web:90f6b290ff6d571e917367"
});

export const db = firebase.firestore()