"use client";
import { createContext, useContext, useState, useEffect, useMemo } from 'react';

// Create context
const AuthContext = createContext(undefined);

// Provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSignOut = () => {
    setUser(null);
  };

  const value = useMemo(() => ({
    user,
    setUser,
    showAuthModal,
    setShowAuthModal,
    handleSignOut,
    handleSignIn: () => setShowAuthModal(true)
  }), [user, showAuthModal]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}