import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged as _onAuthStateChanged,
  NextOrObserver,
  User,
} from "firebase/auth";

import { auth, db } from "@/lib/firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

// creates or updates the user document for the newly authenticated user
const createUserDocument = async (user: User) => {
  const userRef = doc(db, `users/${user.uid}`);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    // the user document does not exist, i.e. they are signing in for the first time
    // so, create the user document with campaigns initialized as an empty array
    try {
      await setDoc(userRef, {
        campaigns: [],
        email: user.email,
      });
    } catch (error) {
      console.error("Error creating user document", error);
    }
  }
};

export function onAuthStateChanged(cb: NextOrObserver<User>) {
  return _onAuthStateChanged(auth, cb);
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    if (result.user) {
      createUserDocument(result.user);
    }
  } catch (error) {
    console.error("Error signing in with Google", error);
  }
}

export async function signOut() {
  try {
    return auth.signOut();
  } catch (error) {
    console.error("Error signing out with Google", error);
  }
}
