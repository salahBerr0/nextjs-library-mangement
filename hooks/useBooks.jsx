"use client";

import { useState, useEffect } from "react";
import {
  fetchBooks,
  borrowBook,
  returnBook,
  fetchMemberBorrowedBooks,
} from "@/lib/mockData";
import { auth } from "@/lib/firebase";

export function useBooks() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedBook, setExpandedBook] = useState(null);
  const [showBookModal, setShowBookModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Load books from Firebase
  useEffect(() => {
    loadBooks();
  }, []);

  // ✅ Listen to auth changes and load borrowed books
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        loadBorrowedBooks();
      } else {
        setBorrowedBooks([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const loadBooks = async () => {
    setLoading(true);
    try {
      const booksData = await fetchBooks();
      setBooks(booksData);
      setFilteredBooks(booksData);
    } catch (error) {
      console.error("Error loading books:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load borrowed books from Firebase members collection
  const loadBorrowedBooks = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setBorrowedBooks([]);
        return;
      }

      const borrowedBooksData = await fetchMemberBorrowedBooks(user.uid);
      // Extract just the bookIds for easy checking
      const bookIds = borrowedBooksData.map((book) => book.bookId);
      setBorrowedBooks(bookIds);
    } catch (error) {
      console.error("Error loading borrowed books:", error);
      setBorrowedBooks([]);
    }
  };

  // ✅ Filter books by search and category
  useEffect(() => {
    let result = books;

    // Filter by search
    if (searchTerm) {
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== "All") {
      result = result.filter((book) => book.category === selectedCategory);
    }

    setFilteredBooks(result);
  }, [searchTerm, selectedCategory, books]);

  const handleBorrow = async (bookId) => {
    try {
      console.log("📚 Borrowing book:", bookId);
      await borrowBook(bookId);

      // Reload borrowed books from Firebase
      await loadBorrowedBooks();

      // Reload books to update available copies
      await loadBooks();

      return { success: true };
    } catch (error) {
      console.error("Error borrowing book:", error);
      alert("Erreur lors de l'emprunt: " + error.message);
      return { success: false, error: error.message };
    }
  };

  // ✅ Return a book
  const handleReturn = async (bookId) => {
    try {
      console.log("📚 Returning book:", bookId);
      await returnBook(bookId);

      // Reload borrowed books from Firebase
      await loadBorrowedBooks();

      // Reload books to update available copies
      await loadBooks();

      return { success: true };
    } catch (error) {
      console.error("Error returning book:", error);
      alert("Erreur lors du retour: " + error.message);
      return { success: false, error: error.message };
    }
  };

  // ✅ Empty functions for admin (called from page.js but not used on user side)
  const handleAddBook = async () => {
    console.log("Add book - Admin only");
  };

  const handleDeleteBook = async () => {
    console.log("Delete book - Admin only");
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
    reloadBooks: loadBooks,
    reloadBorrowedBooks: loadBorrowedBooks,
  };
}
