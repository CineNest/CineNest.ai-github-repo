'use client';
import {
  Auth, // Import Auth type for type hinting
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
  // Assume getAuth and app are initialized elsewhere
} from 'firebase/auth';
import { Firestore, collection, query, where, getDocs } from 'firebase/firestore';

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): void {
  // CRITICAL: Call signInAnonymously directly. Do NOT use 'await signInAnonymously(...)'.
  signInAnonymously(authInstance);
  // Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
}

/** Initiate email/password sign-up (blocking, returns credential). */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string): Promise<UserCredential> {
  return createUserWithEmailAndPassword(authInstance, email, password);
}

/** Initiate email/password sign-in (blocking, returns credential). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string): Promise<UserCredential> {
  return signInWithEmailAndPassword(authInstance, email, password);
}


/** Initiate sign-in with username and password. */
export async function signInWithUsername(authInstance: Auth, db: Firestore, username: string, password: string): Promise<UserCredential> {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("username", "==", username));
  
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    throw new Error("User not found. Please check the username.");
  }
  
  // Assuming username is unique, so we take the first doc.
  const userDoc = querySnapshot.docs[0];
  const userData = userDoc.data();
  
  const email = userData.email;
  if (!email) {
    throw new Error("Could not find an email associated with this username. Please contact support.");
  }

  return signInWithEmailAndPassword(authInstance, email, password);
}
