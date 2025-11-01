// hooks/useBooks.js
'use client';

import { useState, useEffect } from 'react';
import { fetchBooks, borrowBook, returnBook } from '@/lib/mockData'; // ✅ Correct import

export function useBooks() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedBook, setExpandedBook] = useState(null);
  const [showBookModal, setShowBookModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Charger les livres depuis Firebase
  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    setLoading(true);
    try {
      const booksData = await fetchBooks();
      setBooks(booksData);
      setFilteredBooks(booksData);
    } catch (error) {
      console.error('Error loading books:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Filtrer les livres par recherche et catégorie
  useEffect(() => {
    let result = books;

    // Filtre par recherche
    if (searchTerm) {
      result = result.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par catégorie
    if (selectedCategory && selectedCategory !== 'All') {
      result = result.filter(book => book.category === selectedCategory);
    }

    setFilteredBooks(result);
  }, [searchTerm, selectedCategory, books]);

  const handleBorrow = async (bookId) => {
    try {
      console.log('📚 Borrowing book:', bookId);
      await borrowBook(bookId);
      
      // Ajouter à la liste des livres empruntés
      setBorrowedBooks(prev => [...prev, bookId]);
      
      // Recharger les livres pour mettre à jour le nombre de copies
      await loadBooks();
      
      return { success: true };
    } catch (error) {
      console.error('Error borrowing book:', error);
      alert('Erreur lors de l\'emprunt: ' + error.message);
      return { success: false, error: error.message };
    }
  };

  // ✅ Retourner un livre (avec Firebase)
  const handleReturn = async (bookId) => {
    try {
      console.log('📚 Returning book:', bookId);
      await returnBook(bookId);
      
      // Retirer de la liste des livres empruntés
      setBorrowedBooks(prev => prev.filter(id => id !== bookId));
      
      // Recharger les livres pour mettre à jour le nombre de copies
      await loadBooks();
      
      return { success: true };
    } catch (error) {
      console.error('Error returning book:', error);
      alert('Erreur lors du retour: ' + error.message);
      return { success: false, error: error.message };
    }
  };

  // ✅ Fonctions vides pour l'admin (appelées depuis page.js mais pas utilisées côté user)
  const handleAddBook = async () => {
    console.log('Add book - Admin only');
  };

  const handleDeleteBook = async () => {
    console.log('Delete book - Admin only');
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
    loading,
    handleAddBook,
    handleDeleteBook,
    handleBorrow,
    handleReturn,
    reloadBooks: loadBooks
  };
}