/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * @description
 * Elite-tier Firebase Configuration & Database Services Layer.
 * Engineered for maximum resilience, secure connections, and precise error handling.
 */

import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer, Firestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Core Initialization with Strict Typing
const app: FirebaseApp = initializeApp(firebaseConfig);
export const db: Firestore = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth: Auth = getAuth(app);

/**
 * Verifies the upstream connection to the Firestore edge network.
 * Executes asynchronously to prevent blocking the main thread during hydration.
 */
async function testConnection(): Promise<void> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.info('[Firebase Ops] Database connection established successfully.');
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('[Firebase Ops] CRITICAL: Client is offline. Check configuration or network state.');
    } else {
      console.warn('[Firebase Ops] Connection test yielded a non-critical warning:', error);
    }
  }
}

// Initialize connection verification immediately on load
testConnection();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  timestamp: string;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

/**
 * Global Error Handler for Firestore Operations.
 * Sanitizes and structures error payloads for secure monitoring, 
 * while returning safe, sanitized messages to the client UI.
 */
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    timestamp: new Date().toISOString(),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
    },
    operationType,
    path
  };
  
  // Log the complete technical diagnostic payload for developers
  console.error('[Firestore Ops] Transaction Failed:', JSON.stringify(errInfo, null, 2));
  
  // Throw a sanitized error to the UI layer to prevent data leakage
  throw new Error(`Database transaction failed during ${operationType} operation. Please try again or contact support.`);
}