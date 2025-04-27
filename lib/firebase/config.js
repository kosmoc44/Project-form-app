import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB_k5JTYKlcV2Fk6fmMdHxur5Y9mSFcxfM",
  authDomain: "form-project-2d32e.firebaseapp.com",
  projectId: "form-project-2d32e",
  storageBucket: "form-project-2d32e.appspot.com",
  messagingSenderId: "489241550544",
  appId: "1:489241550544:web:ad184b1ed586a5d7d8c8d5",
  measurementId: "G-MJKENFXK0G",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const formsCollection = collection(db, "forms");
export const responsesCollection = collection(db, "responses");
