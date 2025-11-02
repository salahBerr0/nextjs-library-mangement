
"use client";
import { BookOpen, Sparkles, TrendingUp, Plus, Sun, Moon, Flame, Clock,User } from 'lucide-react';

import { useState } from 'react';
import SearchFilters from '../components/books/SearchFilters';
import BookGrid from '../components/books/BookGrid';
import BookModal from '../components/books/BookModal';
import AuthModal from '../components/auth/AuthModal';
import SearchBar from '@/components/books/SearchBar';
import { useAuth } from '../hooks/useAuth';
import { useBooks } from '../hooks/useBooks';


export default function HomePage() {
  const getUserDisplayEmail = () => {
    if (!user) return '';
    if (typeof user.email === 'object') {
      return user.email.email || user.email.value || '';
    }
    return user.email || '';
  };
  const { user, showAuthModal, setShowAuthModal,handleSignIn, handleSignOut } = useAuth();
  
  const [isDarkMode, setIsDarkMode] = useState(false);
  const {
    filteredBooks,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    expandedBook,
    setExpandedBook,
    showBookModal,
    setShowBookModal,
    editingBook,
    setEditingBook,
    borrowedBooks,
    loading,
    handleAddBook,
    handleDeleteBook,
    handleBorrow,
    handleReturn
  } = useBooks();

  return (
    
    <main className={`min-h-screen relative transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'
    }`}>
      {/* Animated background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl transition-all duration-1000 ${
          isDarkMode ? 'bg-blue-900/20' : 'bg-blue-200/40'
        }`}></div>
        <div className={`absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl transition-all duration-1000 ${
          isDarkMode ? 'bg-purple-900/20' : 'bg-purple-200/40'
        }`}></div>
      </div>

      {/* Background blur overlay when modals are open */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-40 transition-all duration-300" />
      )}

      {/* Top Navigation */}
     <nav
  className={`sticky top-0 z-30 backdrop-blur-xl border-b transition-all duration-500 ${
    isDarkMode
      ? "bg-slate-900/80 border-slate-800"
      : "bg-white/80 border-gray-200"
  }`}
>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Layout: logo | search | actions */}
    <div className="grid grid-cols-[auto_1fr_auto] items-center h-16 gap-4">
      
      {/* --- LEFT: LOGO --- */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#004687] to-[#5a9bd6] rounded-xl blur opacity-60"></div>
          <div className="relative w-10 h-10 bg-gradient-to-br from-[#004687] to-[#5a9bd6] rounded-xl flex items-center justify-center shadow-lg">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
        </div>
        <h1
          className={`text-lg font-bold transition-colors duration-500 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          BookWise
        </h1>
      </div>

      


      {/* --- RIGHT: ACTIONS / PROFILE --- */}
      <div className="flex items-center gap-3 justify-end">
        {/* Theme toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`relative p-2 rounded-xl transition-all duration-300 ${
            isDarkMode
              ? "bg-slate-800 hover:bg-slate-700"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          <Sun
            className={`w-5 h-5 absolute transition-all duration-500 ${
              isDarkMode
                ? "rotate-90 scale-0 opacity-0"
                : "rotate-0 scale-100 opacity-100"
            } text-amber-500`}
          />
          <Moon
            className={`w-5 h-5 transition-all duration-500 ${
              isDarkMode
                ? "rotate-0 scale-100 opacity-100"
                : "-rotate-90 scale-0 opacity-0"
            } text-blue-400`}
          />
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
                  <button
                    onClick={() => router.push("/admin")}
                    className="w-full text-left px-3 py-2.5 text-sm text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-150 flex items-center justify-between"
                  >
                    <span>Dashboard</span>
                    <span className="text-blue-400">→</span>
                  </button>
                </div>
              )}

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
        ) : (
          <button
            onClick={handleSignIn}
            className="bg-gradient-to-r from-indigo-900 to-indigo-500 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Sign In
          </button>
        )}
      </div>
    </div>
  </div>
</nav>



      {/* Filters */}
        <div className={`rounded-2xl p-6 mb-6 transition-all duration-500 border backdrop-blur-sm ${
          isDarkMode 
            ? 'bg-slate-800/50 border-slate-700' 
            : 'bg-white/80 border-gray-200'
        }`}>
          <SearchFilters 
            searchTerm={searchTerm} 
            onSearchChange={setSearchTerm} 
            selectedCategory={selectedCategory} 
            onCategoryChange={setSelectedCategory} 
            isAdmin={user?.role === "admin"}
          />
        </div>
         

      {/* Hero Section */}
      <div className="relative z-10 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            {/* Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-500 backdrop-blur-sm ${
              isDarkMode 
                ? 'bg-blue-500/10 border border-blue-500/20' 
                : 'bg-blue-100 border border-blue-200'
            }`}>
              <Flame className={`w-4 h-4 transition-colors duration-500 ${
                isDarkMode ? 'text-orange-400' : 'text-orange-500'
              }`} />
              <span className={`text-sm font-semibold transition-colors duration-500 ${
                isDarkMode ? 'text-blue-300' : 'text-blue-700'
              }`}>
                {filteredBooks.length} Books Available
              </span>
            </div>

           
            

            {/* Subtitle */}
            <p className={`text-lg max-w-2xl mx-auto transition-colors duration-500 ${
              isDarkMode ? 'text-slate-400' : 'text-gray-600'
            }`}>
              Explore our curated collection, borrow your favorites, and track your reading journey
            </p>
            

           
          </div>
        </div>
      </div>

      
      

      {/* Main Content */}
      <section className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 transition-all duration-300 ${
        showAuthModal ? 'blur-sm pointer-events-none' : ''
      }`}>
        

        

        {/* Books Grid */}
        <div className={`rounded-2xl transition-all duration-500 border backdrop-blur-sm ${
          isDarkMode 
            ? 'bg-slate-800/50 border-slate-700' 
            : 'bg-white/80 border-gray-200'
        }`}>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="relative">
                <div className={`animate-spin rounded-full h-16 w-16 border-4 transition-colors duration-500 ${
                  isDarkMode ? 'border-slate-700' : 'border-gray-200'
                }`}></div>
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-transparent bg-gradient-to-r from-[#004687] to-[#5a9bd6] absolute top-0 rounded-full"></div>
              </div>
              <p className={`text-sm font-medium mt-6 transition-colors duration-500 ${
                isDarkMode ? 'text-slate-400' : 'text-gray-600'
              }`}>
                Loading your library...
              </p>
            </div>
          ) : (
            <div className="p-6">
              <BookGrid 
                books={filteredBooks} 
                user={user} 
                expandedBook={expandedBook} 
                onExpandBook={setExpandedBook} 
                onEditBook={(book) => {
                  setEditingBook(book);
                  setShowBookModal(true);
                }} 
                onDeleteBook={handleDeleteBook} 
                onBorrowBook={handleBorrow} 
                onReturnBook={handleReturn} 
                borrowedBooks={borrowedBooks}
              />
            </div>
          )}
        </div>
      </section>

      {/* Modals */}
      {showBookModal && (
        <BookModal 
          book={editingBook} 
          onClose={() => { 
            setShowBookModal(false);
            setEditingBook(null);
          }} 
          onSave={handleAddBook}
        />
      )}

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </main>
  );
}