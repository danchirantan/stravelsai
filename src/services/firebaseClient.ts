import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  getDocFromServer,
  Firestore,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Trip } from '../types/travel';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore with specific database ID if provided
export const db: Firestore = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Connection test helper as specified by skill
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    const testRef = doc(db, '_connection_test', 'status');
    await getDocFromServer(testRef);
    return true;
  } catch (err: any) {
    // If permission-denied or document missing, the server at least answered
    if (err?.code === 'permission-denied' || err?.code === 'not-found') {
      return true;
    }
    console.warn('Firestore connection probe note:', err.message);
    return false;
  }
}

// Sign-in with Google popup
export async function signInWithGoogle(): Promise<FirebaseUser | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error('Google Sign-In error:', error);
    throw error;
  }
}

// Sign-out
export async function logOut(): Promise<void> {
  await firebaseSignOut(auth);
}

// Save trip to user Firestore subcollection
export async function saveUserTrip(userId: string, trip: Trip): Promise<void> {
  if (!userId) return;
  try {
    const tripDocRef = doc(db, `users/${userId}/trips`, trip.id);
    await setDoc(
      tripDocRef,
      {
        ...trip,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('Could not save trip to Firestore:', err);
  }
}

// Load trips from user Firestore subcollection
export async function loadUserTrips(userId: string): Promise<Trip[]> {
  if (!userId) return [];
  try {
    const tripsColl = collection(db, `users/${userId}/trips`);
    const snapshot = await getDocs(triColl(tripsColl));
    const trips: Trip[] = [];
    snapshot.forEach((d) => {
      trips.push(d.data() as Trip);
    });
    return trips;
  } catch (err) {
    console.warn('Could not load trips from Firestore:', err);
    return [];
  }
}

function triColl(collRef: any) {
  return collRef;
}

export type { FirebaseUser };
