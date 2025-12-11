// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBV2CHtGzvOBg8CUpKxJfzk1zZcUs6wM5g",
  authDomain: "multplay-49aee.firebaseapp.com",
  projectId: "multplay-49aee",
  storageBucket: "multplay-49aee.firebasestorage.app",
  messagingSenderId: "461446965872",
  appId: "1:461446965872:web:b3a336ecad4cf8612622b5"
};


export const app = initializeApp(firebaseConfig);


export const db = getFirestore(app);


export const storage = getStorage(app);