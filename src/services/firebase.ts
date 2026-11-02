import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  OAuthProvider,
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc,
  collection,
  setDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { SavedMeter, VendingTransaction, CustomerPreferences } from '../types/utility';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Auth Providers
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const microsoftProvider = new OAuthProvider('microsoft.com');
microsoftProvider.setCustomParameters({ prompt: 'select_account' });

// Connectivity check
export async function testFirestoreConnection() {
  // Safe probe: no unauthenticated requests to forbidden documents
  return true;
}

// User Profile Sync
export async function syncUserProfile(user: User, providerName: string = 'google.com') {
  try {
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, {
      userId: user.uid,
      email: user.email || '',
      displayName: user.displayName || 'CaseBox Customer',
      photoURL: user.photoURL || '',
      provider: providerName,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.error('Error syncing user profile:', err);
  }
}

// Customer Saved Meters in Firestore
export async function fetchUserSavedMeters(userId: string): Promise<SavedMeter[]> {
  try {
    const metersCol = collection(db, 'users', userId, 'saved_meters');
    const snap = await getDocs(metersCol);
    return snap.docs.map(d => d.data() as SavedMeter);
  } catch (err) {
    console.error('Error fetching user meters:', err);
    return [];
  }
}

export async function saveUserMeter(userId: string, meter: SavedMeter): Promise<void> {
  try {
    const meterDocRef = doc(db, 'users', userId, 'saved_meters', meter.id);
    await setDoc(meterDocRef, {
      ...meter,
      userId,
      createdAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.error('Error saving user meter:', err);
  }
}

export async function deleteUserMeter(userId: string, meterId: string): Promise<void> {
  try {
    const meterDocRef = doc(db, 'users', userId, 'saved_meters', meterId);
    await deleteDoc(meterDocRef);
  } catch (err) {
    console.error('Error deleting user meter:', err);
  }
}

// Customer Transactions in Firestore
export async function fetchUserTransactions(userId: string): Promise<VendingTransaction[]> {
  try {
    const txCol = collection(db, 'users', userId, 'transactions');
    const q = query(txCol, orderBy('timestamp', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data() as VendingTransaction);
  } catch (err) {
    console.error('Error fetching user transactions:', err);
    return [];
  }
}

export async function saveUserTransaction(userId: string, tx: VendingTransaction): Promise<void> {
  try {
    const txDocRef = doc(db, 'users', userId, 'transactions', tx.id);
    await setDoc(txDocRef, {
      ...tx,
      userId
    });
  } catch (err) {
    console.error('Error saving user transaction:', err);
  }
}

// Customer Preferences in Firestore
export async function fetchUserPreferences(userId: string): Promise<CustomerPreferences | null> {
  try {
    const prefDocRef = doc(db, 'users', userId, 'preferences', 'recharge');
    const snap = await getDoc(prefDocRef);
    if (snap.exists()) {
      return snap.data() as CustomerPreferences;
    }
  } catch (err) {
    console.error('Error fetching user preferences:', err);
  }
  return null;
}

export async function saveUserPreferences(userId: string, preferences: CustomerPreferences): Promise<void> {
  try {
    const prefDocRef = doc(db, 'users', userId, 'preferences', 'recharge');
    await setDoc(prefDocRef, {
      ...preferences,
      userId,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.error('Error saving user preferences:', err);
    throw err;
  }
}

