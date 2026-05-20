import { initializeApp } from '@firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from '@firebase/auth';
import { getFirestore } from '@firebase/firestore';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBTclX-2Zf23zHii-RKL-RI3qLxbmJfiEA",
  authDomain: "bettermind-cee67.firebaseapp.com",
  projectId: "bettermind-cee67",
  storageBucket: "bettermind-cee67.firebasestorage.app",
  messagingSenderId: "888140500288",
  appId: "1:888140500288:web:bc5c030e4877cda7dafea5",
  measurementId: "G-LFNQBQVGLM"
};

const app = initializeApp(firebaseConfig);

// Use different auth persistence for web vs mobile
export const auth = Platform.OS === 'web'
  ? getAuth(app)
  : initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });

export const db = getFirestore(app);