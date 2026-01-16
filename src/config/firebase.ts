import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDp0j4MPifEnIxg7u_LWmO6b9c8Lrqaj1I",
  authDomain: "atttt-a94d2.firebaseapp.com",
  databaseURL: "https://atttt-a94d2-default-rtdb.firebaseio.com",
  projectId: "atttt-a94d2",
  storageBucket: "atttt-a94d2.appspot.com",
  messagingSenderId: "60550797344",
  appId: "1:60550797344:web:140953870f1d6292100445",
  measurementId: "G-28GWFGSV40"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
