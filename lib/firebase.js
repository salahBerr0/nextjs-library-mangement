import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import{ getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD7uIwf4hPxTnMIjgwFOhM8L1wS2rSukFI",
  authDomain: "library-be9e0.firebaseapp.com",
  projectId: "library-be9e0",
  storageBucket: "library-be9e0.firebasestorage.app",
  messagingSenderId: "364172174877",
  appId: "1:364172174877:web:e8080383e99a6c443508f4"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);