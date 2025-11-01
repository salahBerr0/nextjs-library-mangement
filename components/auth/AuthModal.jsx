"use client";
import React, { useState, useCallback } from "react";
import { X, RotateCw } from "lucide-react";
import { auth, db } from "../../lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import LoginFormMotion from "../layout/LoginFormMotion";
import SignupFormMotion from "../layout/SignupFormMotion";

export default function AuthModal({ onClose }) {
  const [signUpFormData, setSignUpFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loginFormData, setLoginFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoginActive, setIsLoginActive] = useState(true);

  const toggleForms = useCallback(() => {
    setIsLoginActive((prev) => !prev);
    setError("");
  }, [setError]);

  const handleSignup = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");
      setLoading(true);
      try {
        // Create the user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          signUpFormData.email,
          signUpFormData.password
        );

        // Add the user to the members collection
        await setDoc(doc(db, "members", userCredential.user.uid), {
          username: signUpFormData.username,
          email: signUpFormData.email,
          createdAt: new Date().toISOString(),
          role: "member",
          borrowedBooks: [],
          reservedBooks: [],
        });

        setSignUpFormData({ username: "", email: "", password: "" });
        onClose();
      } catch (error) {
        if (error.code === "auth/email-already-in-use") {
          setError(
            "Email is already registered. Please use a different email."
          );
        } else if (error.code === "auth/weak-password") {
          setError("Password should be at least 6 characters long.");
        } else {
          setError(error.message || "Signup failed. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    },
    [signUpFormData, onClose]
  );

  const handleLogin = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");
      setLoading(true);
      try {
        if (!loginFormData.usernameOrEmail.includes("@")) {
          throw new Error("Please enter a valid email address");
        }

        await signInWithEmailAndPassword(
          auth,
          loginFormData.usernameOrEmail,
          loginFormData.password
        );
        setLoginFormData({ usernameOrEmail: "", password: "" });
        onClose();
      } catch (error) {
        if (error.code === "auth/invalid-email") {
          setError("Please enter a valid email address.");
        } else if (error.code === "auth/wrong-password") {
          setError("Incorrect password.");
        } else if (error.code === "auth/user-not-found") {
          setError("No account found with this email.");
        } else {
          setError(
            error.message || "Login failed. Please check your credentials."
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [loginFormData, onClose]
  );

  // Animation variants for better performance
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.2 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.2,
      transition: { duration: 0.3 },
    },
  };

  const cardVariants = {
    active: {
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 700, damping: 20 },
    },
    inactive: {
      x: 50,
      y: 50,
      rotate: 5,
      scale: 0.9,
      opacity: 0.7,
      transition: { type: "spring", stiffness: 1000, damping: 70 },
    },
  };

  return (
    <motion.div
      className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/5 backdrop-blur-sm'
      initial='hidden'
      animate='visible'
      exit='exit'
      variants={modalVariants}
      onClick={onClose}
    >
      <section
        className='rounded-2xl shadow-2xl p-6 w-full max-w-md relative bg-gradient-to-br from-white to-indigo-50/30 border border-white'
        onClick={(e) => e.stopPropagation()}
        style={{ boxShadow: "0 0 5px #ffffff" }}
      >
        <button
          onClick={onClose}
          className='absolute z-30 right-4 top-4 h-8 w-8 hover:bg-gray-100 rounded-full transition-all duration-200 flex items-center justify-center bg-white text-black hover:text-gray-700 shadow-lg'
        >
          <X size={18} />
        </button>
        <button
          onClick={toggleForms}
          className='absolute z-30 left-4 top-4 text-indigo-900 bg-white hover:bg-indigo-50 h-8 w-8 rounded-full font-bold transition-all duration-200 flex items-center justify-center shadow-lg border border-indigo-100'
        >
          <RotateCw size={16} />
        </button>
        <div className='relative w-full h-96 z-10'>
          <AnimatePresence mode='wait'>
            {isLoginActive ? (
              <LoginFormMotion
                error={error}
                handleLogin={handleLogin}
                loginFormData={loginFormData}
                setLoginFormData={setLoginFormData}
                loading={loading}
                cardVariants={cardVariants}
              />
            ) : (
              <SignupFormMotion
                error={error}
                handleSignup={handleSignup}
                signUpFormData={signUpFormData}
                setSignUpFormData={setSignUpFormData}
                loading={loading}
                cardVariants={cardVariants}
              />
            )}
          </AnimatePresence>
        </div>
      </section>
    </motion.div>
  );
}
