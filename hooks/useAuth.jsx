"use client";
import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { auth, db } from "../lib/firebase"; // ✅ Ajoutez db
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // ✅ Ajoutez ces imports

// Create context
const AuthContext = createContext(undefined);

// Provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // 🔥 Récupérer les données depuis Firestore members
        try {
          const memberDoc = await getDoc(doc(db, 'members', firebaseUser.uid));
          const memberData = memberDoc.data();
          
          setUser({
            ...firebaseUser,
            role: memberData?.role || 'user', // ✅ Ajoute le role
            username: memberData?.username,
            type: memberData?.type,
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(firebaseUser); // Fallback sans role
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const value = useMemo(
    () => ({
      user,
      setUser,
      showAuthModal,
      setShowAuthModal,
      handleSignOut,
      handleSignIn: () => setShowAuthModal(true),
      loading,
    }),
    [user, showAuthModal, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use auth
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}