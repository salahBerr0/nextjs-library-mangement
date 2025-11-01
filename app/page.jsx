"use client";
import SearchFilters from '../components/books/SearchFilters';
import BookGrid from '../components/books/BookGrid';
import BookModal from '../components/books/BookModal';
import AuthModal from '../components/auth/AuthModal';
import { useAuth } from '../hooks/useAuth';
import { useBooks } from '../hooks/useBooks';
import SearchBar from '@/components/books/SearchBar';

export default function HomePage() {
  const { user, showAuthModal, setShowAuthModal } = useAuth();
  
  // Remove initialBooks parameter since useBooks now uses Firebase
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
    handleAddBook,
    handleDeleteBook,
    handleBorrow,
    handleReturn
  } = useBooks(); // No initialBooks parameter needed

  return (
    <main className="min-h-screen grid content-center justify-items-center overflow-hidden bg-gray-950 py-5">
      {/* Background blur when auth modal is open */}
      {showAuthModal && (<div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40" />)}
      
      <div className='z-30 w-full items-center justify-center'>
        <SearchBar  
          searchTerm={searchTerm}  
          onSearchChange={setSearchTerm}  
          isAdmin={user?.isAdmin}  
          onAddBook={() => {
            setEditingBook(null);
            setShowBookModal(true);
          }}
        />
      </div>
      
      <section className={`max-w-7xl z-0 mx-auto pt-16 px-4 py-8 grid content-center justify-items-center gap-5 transition-all duration-300 ${
        showAuthModal ? 'blur-sm pointer-events-none' : ''}`}>
        
        <SearchFilters 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm} 
          selectedCategory={selectedCategory} 
          onCategoryChange={setSelectedCategory} 
          isAdmin={user?.isAdmin}
        />
        
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
      </section>

      {/* Book Management Modal */}
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

      {/* Authentication Modal */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </main>
  );
}