'use client';
import {
  Auth, // Import Auth type for type hinting
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
  UserCredential,
  // Assume getAuth and app are initialized elsewhere
} from 'firebase/auth';
import { Firestore, collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { errorEmitter } from './error-emitter';
import { FirestorePermissionError } from './errors';

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): void {
  // CRITICAL: Call signInAnonymously directly. Do NOT use 'await signInAnonymously(...)'.
  signInAnonymously(authInstance);
  // Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
}

/** Initiate email/password sign-up (blocking, returns credential). */
export async function initiateEmailSignUp(
  authInstance: Auth, 
  db: Firestore, 
  email: string, 
  password: string, 
  profileData: { username: string; email: string }
): Promise<UserCredential> {
  const userCredential = await createUserWithEmailAndPassword(authInstance, email, password);
  const user = userCredential.user;

  if (user) {
    const userDocRef = doc(db, 'users', user.uid);
    const dataToSet = {
        id: user.uid,
        ...profileData
    };
    
    // Use a non-blocking write with custom error handling
    setDoc(userDocRef, dataToSet, { merge: true }).catch(error => {
      // Create a rich, contextual error and emit it globally.
      const permissionError = new FirestorePermissionError({
        path: userDocRef.path,
        operation: 'create', // or 'write'
        requestResourceData: dataToSet,
      });
      errorEmitter.emit('permission-error', permissionError);
      
      // We don't re-throw here because the listener will handle it.
      // We also don't need a console.error.
    });
  }
  
  return userCredential;
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
