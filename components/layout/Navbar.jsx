"use client";
import { BookOpen, User, Bell, Menu, X, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import {  Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function Navbar() {
  const router=useRouter();
  const { user, handleSignIn, handleSignOut } = useAuth();
  console.log('User complet:', user);
  console.log('User role:', user?.role);
  const { isDarkMode, toggleDarkMode } = useTheme();

  const [isScrolled, setIsScrolled]=useState(false)
  
  useEffect(() => {
    const handleScroll = () => {setIsScrolled(window.scrollY > 10);};
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const getUserDisplayEmail = () => {
    if (!user) return '';
    if (typeof user.email === 'object') {
      return user.email.email || user.email.value || '';
    }
    return user.email || '';
  };

  return (
    <nav className={`sticky top-0 z-30 flex items-center justify-between px-10 py-2 backdrop-blur-xl border-b transition-all duration-500 ${ isDarkMode? "bg-gradient-to-r from-slate-900 to-blue-500 border-slate-800": "bg-white/80 border-gray-200"}`} style={{boxShadow:'0 1px 5px #5a9bd6'}}>
        {/* --- LEFT: LOGO --- */}
        <Link href='/' className="flex items-center gap-3">
          <div className="relative w-10 h-10 bg-gradient-to-br from-[#004687] to-[#5a9bd6] rounded-xl flex items-center justify-center shadow-lg">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <h1 className={`text-lg font-bold transition-colors duration-500 ${ isDarkMode ? "text-white" : "text-gray-900"}`}>BookWise</h1>
        </Link>
        {/* --- RIGHT: ACTIONS / PROFILE --- */}
        <div className="flex items-center gap-3 justify-end">
          {/* Theme toggle */}
          <button onClick={toggleDarkMode} className={`relative p-2 rounded-xl transition-all duration-300 ${ isDarkMode? "bg-slate-800 hover:bg-slate-700": "bg-gray-100 hover:bg-gray-200"}`}>
            <Sun className={`w-5 h-5 absolute transition-all duration-500 ${ isDarkMode ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"} text-amber-500`}/>
            <Moon className={`w-5 h-5 transition-all duration-500 ${ isDarkMode? "rotate-0 scale-100 opacity-100": "-rotate-90 scale-0 opacity-0"} text-blue-400`}/>
          </button>

          {/* Profile or Sign In */}
          {user ? (
            <div className="relative group">
              <button className="flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-gray-50 px-4 py-2.5 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-200 shadow-sm">
                <div className="bg-gradient-to-br from-[#004687] to-[#5a9bd6] text-white p-1.5 rounded-lg">
                  <User className="w-4 h-4" />
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-semibold text-gray-900">
                    {getUserDisplayEmail().split("@")[0]}
                  </div>
                </div>
              </button>

              {/* Dropdown */}
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-4 border-b border-gray-100">
                  <div className="text-sm font-semibold text-gray-900">
                    Account
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {getUserDisplayEmail()}
                  </div>
                </div>

                {user && user.role === "admin" && (
                  <div className="p-2 border-t border-gray-100">
                    <button onClick={() => router.push("/admin")} className="w-full text-left px-3 py-2.5 text-sm text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-150 flex items-center justify-between">
                      <span>Dashboard</span>
                      <span className="text-blue-400">→</span>
                    </button>
                  </div>
                )}

                <div className="p-2 border-t border-gray-100">
                  <button onClick={handleSignOut} className="w-full text-left px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150 flex items-center justify-between">
                    <span>Sign Out</span>
                    <span className="text-red-400">→</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button onClick={handleSignIn} className="bg-gradient-to-r from-indigo-900 to-indigo-500 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg transform hover:scale-105 transition-all duration-200">Sign In
            </button>
          )}
        </div>
  </nav>
  );
}