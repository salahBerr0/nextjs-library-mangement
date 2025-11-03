
"use client";
import { BookOpen, Sparkles, TrendingUp, Plus, Sun, Moon, Flame, Clock,User } from 'lucide-react';
import { useRouter } from "next/navigation"
import { useState } from 'react';
import SearchFilters from '../components/books/SearchFilters';
import BookGrid from '../components/books/BookGrid';
import BookModal from '../components/books/BookModal';
import AuthModal from '../components/auth/AuthModal';
import SearchBar from '@/components/books/SearchBar';
import { useAuth } from '../hooks/useAuth';
import { useBooks } from '../hooks/useBooks';
import { useTheme } from '@/components/contexts/ThemeContext';

export default function HomePage() {
  const router = useRouter();
  const {user, showAuthModal, setShowAuthModal } = useAuth();
  const { isDarkMode } = useTheme();

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
    
    <main className={`min-h-screen relative grid content-center justify-items-center gap-5 transition-all p-5 duration-500 ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'}`}>
        <SearchBar  searchTerm={searchTerm}  onSearchChange={setSearchTerm}/>
      <div className={`rounded-2xl p-6 w-max transition-all duration-500 border backdrop-blur-sm ${ isDarkMode   ? 'bg-slate-800/50 border-slate-700'   : 'bg-white/80 border-gray-200'}`}>
        <SearchFilters  searchTerm={searchTerm}  onSearchChange={setSearchTerm}  selectedCategory={selectedCategory}  onCategoryChange={setSelectedCategory}  isAdmin={user?.role === "admin"}/>
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
                <div className="animate-spin h-16 w-16 border-4 border-t-transparent bg-gradient-to-r from-[#004687] to-[#5a9bd6] absolute top-0 rounded-full"></div>
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