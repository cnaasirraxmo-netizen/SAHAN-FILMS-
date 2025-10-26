

// FIX: Use Firebase v9 compat libraries to resolve module export errors.
import firebase from "firebase/compat/app";
import "firebase/compat/analytics";
import "firebase/compat/auth";
import "firebase/compat/firestore";

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
const app = firebase.initializeApp(firebaseConfig);
// FIX: Use compat API for Analytics
const analytics = firebase.analytics ? firebase.analytics(app) : undefined;
// FIX: Use compat API for Auth and Firestore
export const auth = firebase.auth();
export const db = firebase.firestore();

// Example Firestore Functions

/**
 * Adds or updates user data in the 'users' collection.
 * @param uid - The user's unique ID from Firebase Auth.
 * @param data - The user data to store (e.g., { email, name }).
 */
export const addUser = async (uid: string, data: object) => {
  try {
    // FIX: Use compat API for Firestore
    await db.collection("users").doc(uid).set(data, { merge: true });
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
    // FIX: Use compat API for Firestore
    const userDocRef = db.collection("users").doc(uid);
    const docSnap = await userDocRef.get();

    if (docSnap.exists) {
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
export const deleteUserDocument = async (uid: string) => {
  try {
    // FIX: Use compat API for Firestore
    await db.collection("users").doc(uid).delete();
    console.log("User document deleted successfully for UID:", uid);
  } catch (error) {
    console.error("Error deleting user document:", error);
  }
};


export { app, analytics };