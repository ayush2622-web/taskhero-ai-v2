// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import{ getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDO1XSUystwPQbndKEEpgJYjScqSFWcqQs",
  authDomain: "lifesaver-ai-162e3.firebaseapp.com",
  projectId: "lifesaver-ai-162e3",
  storageBucket: "lifesaver-ai-162e3.firebasestorage.app",
  messagingSenderId: "453409041999",
  appId: "1:453409041999:web:7add6d009ae3ba892e043a",
  measurementId: "G-EQ7537LH9R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
