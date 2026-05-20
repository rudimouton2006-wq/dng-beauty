/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBZ82E6D1VtewCEVbPQu5KsRDiodBqArEQ",
  authDomain: "dng-beauty.firebaseapp.com",
  projectId: "dng-beauty",
  storageBucket: "dng-beauty.firebasestorage.app",
  messagingSenderId: "701488449355",
  appId: "1:701488449355:web:83cf424443b4c3ffc8cace",
  measurementId: "G-V8KCXHF092"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the Auth and Database instances for the rest of the app to use
export const auth = getAuth(app);
export const db = getFirestore(app);