import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔥 Firebase Configuration Setup
//
// SETUP INSTRUCTIONS:
// 1. Copy .env.example to .env in the project root
// 2. Create a Firebase project at https://console.firebase.google.com/
// 3. Enable Email/Password Authentication
// 4. Create a Firestore database (test mode)
// 5. Get your config from Project Settings → Your apps
// 6. Add all values to your .env file
// 7. Restart the dev server
//
// Why use .env?
// - Secure (never commit .env to git)
// - Professional best practice
// - Easy to manage credentials

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};


// Validate configuration
if (!firebaseConfig.apiKey) {
  console.error(
    "⚠️ Firebase not configured! Steps:\n" +
    "1. Copy .env.example to .env\n" +
    "2. Add your Firebase credentials\n" +
    "3. Restart dev server"
  );
}

// Initialize Firebase services
export const firebase = initializeApp(firebaseConfig);
export const auth = getAuth(firebase);
export const db = getFirestore(firebase);