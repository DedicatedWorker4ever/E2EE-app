import { initializeApp } from "firebase/app";

import {getReactNativePersistence, initializeAuth} from 'firebase/auth';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getFirestore, collection} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAPycxq83GFoKPyoBHKDPpB0Gnsg_uRoQY",
  authDomain: "messaging-app-9a30c.firebaseapp.com",
  projectId: "messaging-app-9a30c",
  storageBucket: "messaging-app-9a30c.appspot.com",
  messagingSenderId: "888895540202",
  appId: "1:888895540202:web:926a298a58cb58222ec093",
  measurementId: "G-CP27GZLCWP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);

export const usersRef = collection(db, 'users');
export const roomRef = collection(db, 'rooms');
