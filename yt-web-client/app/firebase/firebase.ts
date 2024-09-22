import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from "firebase/auth";
import { getFunctions } from "firebase/functions";

// web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAGIHx4usf8_PlyJFzGgdn3VcNYV2XmKbY",
  authDomain: "yt-clone-a06b2.firebaseapp.com",
  projectId: "yt-clone-a06b2",
  appId: "1:673797505512:web:102fbb8669588827b3e45d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
export const functions = getFunctions();

/**
 * Signs the user in with a Google popup.
 * @returns A promise that resolves with the user's credentials.
 */
export function signInWithGoogle() {
  return signInWithPopup(auth, new GoogleAuthProvider());
}

/**
 * Signs the user out.
 * @returns A promise that resolves when the user is signed out.
 */
export function signOut() {
  return auth.signOut();
}

/**
 * Trigger a callback when user auth state changes.
 * @returns A function to unsubscribe callback.
 */
export function onAuthStateChangedHelper(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
