"use client";
import { BookOpen, User, Bell, Menu, X, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import {  Sun, Moon } from 'lucide-react';




export default function Navbar() {
  const router=useRouter();
  const { user, handleSignIn, handleSignOut } = useAuth();
  console.log('User complet:', user);
  console.log('User role:', user?.role);
  const [isDarkMode, setIsDarkMode] = useState(false);
  

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const handleScroll = () => {setIsScrolled(window.scrollY > 10);};
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const onAddBook=()=>{
    setEditingBook(null);setShowBookModal(true);
  }

  const getUserDisplayEmail = () => {
    if (!user) return '';
    if (typeof user.email === 'object') {
      return user.email.email || user.email.value || '';
    }
    return user.email || '';
  };

  return (
    <>
      <nav className={`bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 transition-all duration-300 ${ isScrolled ? 'shadow-lg' : 'shadow-sm'}`} style={{boxShadow:"0 0 15px #ffffff"}}>
        <div className="max-w-7xl flex items-center justify-between h-16 mx-auto px-4 sm:px-6 lg:px-8">
          <Link href='/' className="flex items-center space-x-3">
            <BookOpen className="w-6 h-6 text-green-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-900 to-indigo-500 bg-clip-text text-transparent">BookWise</h1>
          </Link>
         
          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="p-2.5 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg border border-slate-700 transition-all duration-300 group"
                    aria-label="Toggle dark mode"
                  >
                    <div className="relative w-5 h-5">
                      <Sun className={`w-5 h-5 absolute transition-all duration-300 ${
                        isDarkMode ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
                      } text-yellow-400`} />
                      <Moon className={`w-5 h-5 absolute transition-all duration-300 ${
                        isDarkMode ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
                      } text-blue-400`} />
                    </div>
                  </button>
            {/* Notifications */}
            {user && (
              <div className="relative">
                <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">1</span>
                </button>
              </div>
            )}

            {/* User Section */}
            {user ? (
              <div className="flex items-center space-x-3">
                {/* User Avatar */}
                <div className="relative group">
                  <button className="flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-gray-50 px-4 py-2.5 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-200 shadow-sm">
                    <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-1.5 rounded-lg"><User className="w-4 h-4" /></div>
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-semibold text-gray-900">
                        {getUserDisplayEmail().split('@')[0]}
                      </div>
                      
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                 
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
  {/* Section profil */}
  <div className="p-4 border-b border-gray-100">
    <div className="text-sm font-semibold text-gray-900">Account</div>
    <div className="text-xs text-gray-500 truncate">{getUserDisplayEmail()}</div>
  </div>

  {/* ✅ Lien Dashboard si admin */}
  {user && user.role === "admin" && (
    <div className="p-2 border-t border-gray-100">
      <button
        onClick={() => router.push("/admin")}
        className="w-full text-left px-3 py-2.5 text-sm text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-150 flex items-center justify-between"
      >
        <span>Dashboard</span>
        <span className="text-blue-400">→</span>
      </button>
    </div>
  )}
  

  {/* Bouton Sign Out */}
  <div className="p-2 border-t border-gray-100">
    <button
      onClick={handleSignOut}
      className="w-full text-left px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150 flex items-center justify-between"
    >
      <span>Sign Out</span>
      <span className="text-red-400">→</span>
    </button>
  </div>
</div>

                </div>
              </div>
            ) : (
              <button onClick={handleSignIn} className="bg-gradient-to-r from-indigo-900 to-indigo-500 hover:from-indigo-900 hover:to-blue-800 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200" style={{boxShadow:'0 0 2px #000000'}}>Sign In</button>
            )}

            {/* Mobile Menu Button */}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200">{isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
          </div>
        </div>
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-4 py-3 space-y-1">
              {/* Mobile Navigation Items */}
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a key={item.name} href={item.href} className="flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-700 hover:text-blue-700 hover:bg-blue-50 transition-all duration-200 font-medium">
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="fixed right-4 top-20 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">1 new</span>
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {/* Notification items would go here */}
            <div className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
              <div className="text-sm font-medium text-gray-900">Book Due Soon</div>
              <div className="text-xs text-gray-500 mt-1">"The Great Gatsby" is due in 2 days</div>
            </div>
          </div>
        </div>
      )}

      {/* Overlay for mobile menu and notifications */}
      {(isMobileMenuOpen || showNotifications) && (<div  className="fixed inset-0 bg-black bg-opacity-10 z-40 md:hidden" onClick={() => {setIsMobileMenuOpen(false);setShowNotifications(false);}}/>)}
    </>
  );
}