"use client";
import { useState, useEffect } from 'react';

export function useBooks(initialBooks) {
  const [books, setBooks] = useState(initialBooks);
  const [filteredBooks, setFilteredBooks] = useState(initialBooks);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedBook, setExpandedBook] = useState(null);
  const [showBookModal, setShowBookModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [borrowedBooks, setBorrowedBooks] = useState({});

  useEffect(() => {
    filterBooks();
  }, [searchTerm, selectedCategory, books]);

  const filterBooks = () => {
    let filtered = books;
    
    if (searchTerm) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(book => book.category === selectedCategory);
    }
    
    setFilteredBooks(filtered);
  };

  const handleAddBook = (bookData) => {
    if (editingBook) {
      setBooks(books.map(b => b.id === editingBook.id ? { ...bookData, id: editingBook.id } : b));
      setEditingBook(null);
    } else {
      const newBook = { ...bookData, id: Date.now().toString() };
      setBooks([...books, newBook]);
    }
    setShowBookModal(false);
  };

  const handleDeleteBook = (bookId) => {
    setBooks(books.filter(b => b.id !== bookId));
    if (expandedBook?.id === bookId) setExpandedBook(null);
  };

  const handleBorrow = (bookId) => {
    setBooks(books.map(b => 
      b.id === bookId ? { ...b, copies: b.copies - 1 } : b
    ));
    setBorrowedBooks({ ...borrowedBooks, [bookId]: true });
  };

  const handleReturn = (bookId) => {
    setBooks(books.map(b => 
      b.id === bookId ? { ...b, copies: b.copies + 1 } : b
    ));
    const newBorrowed = { ...borrowedBooks };
    delete newBorrowed[bookId];
    setBorrowedBooks(newBorrowed);
  };

  return {
    books,
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
  };
}