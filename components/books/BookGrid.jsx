import { BookOpen, Loader2 } from 'lucide-react';
import BookCard from './BookCard';

export default function BookGrid({
  books,
  user,
  expandedBook,
  onExpandBook,
  onEditBook,
  onDeleteBook,
  onBorrowBook,
  onReturnBook,
  borrowedBooks,
  isLoading = false
}) {

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative">
          <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
          <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full animate-ping"></div>
        </div>
        <p className="text-gray-400 mt-4 text-lg">Loading your library...</p>
        <p className="text-gray-500 text-sm mt-2">Discovering amazing books</p>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-40">
        <h3 className="text-2xl font-semibold text-gray-300 mb-4">No books found</h3>
        <p className="text-gray-400 max-w-md mx-auto leading-relaxed text-lg mb-6">
          We couldn't find any books matching your search criteria.
        </p>
        <article className="flex justify-center gap-3 text-sm text-gray-500">
          <span className="bg-gray-800 px-3 py-1 rounded-full">Try different keywords</span>
          <span className="bg-gray-800 px-3 py-1 rounded-full">Adjust filters</span>
          <span className="bg-gray-800 px-3 py-1 rounded-full">Browse all categories</span>
        </article>
      </div>
    );
  }

  return (
    <div className='transition-opacity z-0 duration-300 opacity-100'>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Library Collection</h2>
          <p className="text-gray-400 mt-1">
            Showing <span className="text-emerald-400 font-semibold">{books.length}</span> book{books.length !== 1 ? 's' : ''}
            {expandedBook && ' • 1 book expanded'}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <BookOpen className="w-4 h-4" />
          <span>Total: {books.reduce((sum, book) => sum + book.copies, 0)} copies</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 auto-rows-fr">
        {books.map(book => (
          <BookCard 
            key={book.id} 
            book={book} 
            isAdmin={user?.isAdmin || false} 
            isExpanded={expandedBook?.id === book.id}  
            onExpand={onExpandBook}  
            onEdit={onEditBook}  
            onDelete={onDeleteBook}  
            onBorrow={onBorrowBook}  
            onReturn={onReturnBook}  
            isBorrowed={borrowedBooks.includes(book.id)} // ✅ CORRIGÉ ICI
          />
        ))}
      </div>
    </div>
  );
}