"use client";
import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { auth } from "../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

// Create context
const AuthContext = createContext(undefined);

// Provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
  try {
    await signOut(auth);
    setUser(null);
    window.location.href = "/"; // 👈 AJOUT - Redirection vers home
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
