// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// FIX: Use modular imports for Firebase v9+ SDK.
import { getAuth } from "firebase/auth";
// FIX: Use modular imports for Firebase v9+ SDK.
import { getFirestore, setDoc, doc, getDoc, deleteDoc } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBor8nb5QENbxqV0wXGiVZB9GEnW6hCTcs",
  authDomain: "sahan-films.firebaseapp.com",
  projectId: "sahan-films",
  storageBucket: "sahan-films.firebasestorage.app",
  messagingSenderId: "127827980825",
  appId: "1:127827980825:web:842635dbc1bab5b21ef088",
  measurementId: "G-9X8JXS0D04"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// FIX: Use modularly imported getAuth function.
const auth = getAuth(app);
const db = getFirestore(app);

// Example Firestore Functions

/**
 * Adds or updates user data in the 'users' collection.
 * @param uid - The user's unique ID from Firebase Auth.
 * @param data - The user data to store (e.g., { email, name }).
 */
export const addUser = async (uid: string, data: object) => {
  try {
    // FIX: Use modularly imported firestore functions.
    await setDoc(doc(db, "users", uid), data, { merge: true });
    console.log("User data saved successfully for UID:", uid);
  } catch (error) {
    console.error("Error writing user document: ", error);
  }
};

/**
 * Reads a user's document from the 'users' collection.
 * @param uid - The user's unique ID.
 * @returns The user's data object or null if not found.
 */
export const getUser = async (uid: string) => {
  try {
    // FIX: Use modularly imported firestore functions.
    const userDocRef = doc(db, "users", uid);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      console.log("User data:", docSnap.data());
      return docSnap.data();
    } else {
      console.log("No such user document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting user document:", error);
    return null;
  }
};

/**
 * Deletes a user's document from the 'users' collection.
 * @param uid - The user's unique ID.
 */
export const deleteUser = async (uid: string) => {
  try {
    // FIX: Use modularly imported firestore functions.
    await deleteDoc(doc(db, "users", uid));
    console.log("User document deleted successfully for UID:", uid);
  } catch (error) {
    console.error("Error deleting user document:", error);
  }
};


export { app, analytics, auth, db };