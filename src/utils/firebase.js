import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB-tLQxlDRSaSknmXArazln17M8hukak1A",
  authDomain: "reddit-clone-f6b78.firebaseapp.com",
  projectId: "reddit-clone-f6b78",
  storageBucket: "reddit-clone-f6b78.appspot.com",
  messagingSenderId: "18688865261",
  appId: "1:18688865261:web:15e45796f516b137662de4"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);