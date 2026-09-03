import { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "../firebase";

const AuthContext = createContext(null);

async function ensureUserProfile(firebaseUser, extraData = {}) {
  if (!firebaseUser) return null;

  try {
    const ref = doc(db, "users", firebaseUser.uid);
    const snap = await getDoc(ref);

    const displayName =
      extraData.displayName ||
      firebaseUser.displayName ||
      firebaseUser.email?.split("@")[0] ||
      "User";

    if (!snap.exists()) {
      const profile = {
        uid: firebaseUser.uid,
        displayName,
        email: firebaseUser.email || "",
        photoURL: firebaseUser.photoURL || null,
        bio: "",
        joinedAt: serverTimestamp(),
        opinionsCount: 0,
      };

      await setDoc(ref, profile);

      return {
        ...profile,
        joinedAt: new Date(),
      };
    }

    return snap.data();
  } catch (error) {
    // IMPORTANT:
    // Firestore profile failure should NOT make Firebase login fail.
    console.warn("Could not sync Firestore profile:", error);

    return {
      uid: firebaseUser.uid,
      displayName:
        extraData.displayName ||
        firebaseUser.displayName ||
        firebaseUser.email?.split("@")[0] ||
        "User",
      email: firebaseUser.email || "",
      photoURL: firebaseUser.photoURL || null,
      bio: "",
      opinionsCount: 0,
    };
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  async function signup(email, password, displayName) {
    const cred = await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );

    await updateProfile(cred.user, {
      displayName: displayName.trim(),
    });

    // Don't let Firestore failure make signup appear failed.
    const profile = await ensureUserProfile(cred.user, {
      displayName: displayName.trim(),
    });

    setUser(cred.user);
    setUserProfile(profile);

    return cred;
  }

  async function login(email, password) {
    const cred = await signInWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );

    // Auth success is independent from Firestore profile sync.
    const profile = await ensureUserProfile(cred.user);

    setUser(cred.user);
    setUserProfile(profile);

    return cred;
  }

  async function loginWithGoogle() {
    const cred = await signInWithPopup(auth, googleProvider);

    const profile = await ensureUserProfile(cred.user);

    setUser(cred.user);
    setUserProfile(profile);

    return cred;
  }

  async function resetPassword(email) {
    return sendPasswordResetEmail(auth, email.trim());
  }

  async function logout() {
    await signOut(auth);
    setUser(null);
    setUserProfile(null);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        setUser(firebaseUser);

        if (!firebaseUser) {
          setUserProfile(null);
          return;
        }

        const profile = await ensureUserProfile(firebaseUser);
        setUserProfile(profile);
      } catch (error) {
        console.error("Auth state error:", error);

        // Firebase user is still valid even if profile sync fails.
        setUser(firebaseUser);
      } finally {
        // VERY IMPORTANT:
        // Never leave the application stuck on loading.
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        signup,
        login,
        loginWithGoogle,
        logout,
        resetPassword,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}