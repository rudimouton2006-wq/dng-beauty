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

// Export the Auth and Database instances
export const auth = getAuth(app);
export const db = getFirestore(app);

// --- Custom Error Handling Utilities ---
export type OperationType = 'create' | 'read' | 'update' | 'delete';

export const handleFirestoreError = (error: any, operation: OperationType): string => {
  console.error(`Firestore ${operation} error:`, error);
  
  if (error?.code === 'permission-denied') {
    return "You do not have permission to perform this action.";
  }
  if (error?.code === 'unavailable') {
    return "Network error. Please check your connection and try again.";
  }
  
  return "An unexpected error occurred processing your booking. Please try again.";
};