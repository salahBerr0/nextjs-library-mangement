"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { useTheme } from '@/components/contexts/ThemeContext';

export default function AdminDashboard() {
    const { isDarkMode } = useTheme();

  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("books");
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [borrowings, setBorrowings] = useState([]);
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [editingBook, setEditingBook] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  const [searchBook, setSearchBook] = useState("");
  const [searchMember, setSearchMember] = useState("");

  const [bookForm, setBookForm] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "Fiction",
    copies: 1,
    coverImage: "",
    description: "",
  });

  const [borrowingForm, setBorrowingForm] = useState({
    memberId: "",
    bookId: "",
    dueDate: "",
  });

  useEffect(() => {
    loadBooks();
    loadMembers();
    loadBorrowings();
    const today = new Date();
    const defaultDueDate = new Date(today.setDate(today.getDate() + 14));
    setBorrowingForm((prev) => ({
      ...prev,
      dueDate: defaultDueDate.toISOString().split("T")[0],
    }));
  }, []);

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "success" }), 4000);
  };

  // === BOOKS FUNCTIONS ===
  const loadBooks = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "books"));
      const booksData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBooks(booksData);
    } catch (error) {
      console.error("Error loading books:", error);
      showAlert("Error loading books", "error");
    }
  };

  const addBook = async (e) => {
    e.preventDefault();
    try {
      const copies = parseInt(bookForm.copies);
      await addDoc(collection(db, "books"), {
        ...bookForm,
        copies,
        available: copies,
        addedDate: Timestamp.now(),
      });
      showAlert("Book added successfully!");
      setBookForm({
        title: "",
        author: "",
        isbn: "",
        category: "Fiction",
        copies: 1,
        coverImage: "",
        description: "",
      });
      loadBooks();
    } catch (error) {
      showAlert("Error adding book: " + error.message, "error");
    }
  };

  const editBook = (book) => {
    setEditingBook(book);
    setBookForm({
      title: book.title,
      author: book.author,
      isbn: book.isbn || "",
      category: book.category || "Fiction",
      copies: book.copies || 1,
      coverImage: book.coverImage || "",
      description: book.description || "",
    });
  };

  const updateBook = async (e) => {
    e.preventDefault();
    try {
      const newCopies = parseInt(bookForm.copies);
      const currentCopies = editingBook.copies;
      
      // Calculate new available count
      let newAvailable;
      if (newCopies < currentCopies) {
        // If decreasing copies, adjust available count proportionally
        // but ensure available doesn't exceed new total copies
        const currentAvailable = editingBook.available !== undefined ? editingBook.available : currentCopies;
        newAvailable = Math.min(currentAvailable, newCopies);
      } else {
        // If increasing copies, add the difference to available
        const currentAvailable = editingBook.available !== undefined ? editingBook.available : currentCopies;
        newAvailable = currentAvailable + (newCopies - currentCopies);
      }

      await updateDoc(doc(db, "books", editingBook.id), {
        ...bookForm,
        copies: newCopies,
        available: newAvailable,
      });
      showAlert("Book updated successfully!");
      setEditingBook(null);
      setBookForm({
        title: "",
        author: "",
        isbn: "",
        category: "Fiction",
        copies: 1,
        coverImage: "",
        description: "",
      });
      loadBooks();
    } catch (error) {
      showAlert("Error updating book: " + error.message, "error");
    }
  };

  const deleteBook = async (bookId) => {
    if (confirm("Are you sure you want to delete this book?")) {
      try {
        await deleteDoc(doc(db, "books", bookId));
        showAlert("Book deleted successfully!");
        loadBooks();
      } catch (error) {
        showAlert("Error deleting: " + error.message, "error");
      }
    }
  };

  // === MEMBERS FUNCTIONS ===
  const loadMembers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "members"));
      const membersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMembers(membersData);
    } catch (error) {
      console.error("Error loading members:", error);
      showAlert("Error loading members", "error");
    }
  };

  const updateMemberType = async (memberId, newType) => {
    try {
      await updateDoc(doc(db, "members", memberId), { role: newType });
      showAlert("Member type updated");
      loadMembers();
    } catch (error) {
      showAlert("Error updating: " + error.message, "error");
    }
  };

  const deleteMember = async (memberId) => {
    if (confirm("Are you sure you want to delete this member?")) {
      try {
        await deleteDoc(doc(db, "members", memberId));
        showAlert("Member deleted successfully!");
        loadMembers();
      } catch (error) {
        showAlert("Error deleting: " + error.message, "error");
      }
    }
  };

  // === BORROWINGS FUNCTIONS ===
  const loadBorrowings = async () => {
    try {
      const q = query(
        collection(db, "borrowings"),
        where("status", "==", "borrowed")
      );
      const querySnapshot = await getDocs(q);
      const borrowingsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBorrowings(borrowingsData);
    } catch (error) {
      console.error("Error loading borrowings:", error);
      showAlert("Error loading borrowings", "error");
    }
  };

  // Filtered data
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchBook.toLowerCase()) ||
      book.author.toLowerCase().includes(searchBook.toLowerCase())
  );

  const filteredMembers = members.filter(
    (member) =>
      member.username.toLowerCase().includes(searchMember.toLowerCase()) ||
      member.email.toLowerCase().includes(searchMember.toLowerCase())
  );

  const availableBooks = books.filter((book) => book.available > 0);

  // Stats
  const totalBooksCopies = books.reduce((sum, book) => sum + book.copies, 0);
  const availableCopies = books.reduce((sum, book) => sum + (book.available !== undefined ? book.available : book.copies), 0);
  const borrowedCopies = totalBooksCopies - availableCopies;
  const activeMembers = members.filter((m) => (m.borrowCount || 0) > 0).length;

  return (
    <main className={`min-h-screen p-4 md:p-8 ${isDarkMode ? 'bg-slate-900 text-gray-100' : 'bg-blue-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Modern header with library-appropriate gradient */}
        <header className="relative overflow-hidden bg-blue-950   rounded-2xl shadow-xl p-8 mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent"></div>

          <div className="relative z-10 flex flex-wrap items-center justify-between">
            {/* --- LOGO + TITLE --- */}
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => router.push("/")}
            >
              <Image
                src="/leS.png"
                alt="Logo"
                width={100}
                height={100}
                className="rounded-md"
              />
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                BOOKWISE
              </h1>
            </div>

            {/* Modern tabs */}
            <div className="flex gap-3 items-center justify-center overflow-visible">
              <button
                onClick={() => setActiveTab("books")}
                className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform whitespace-nowrap ${
                  activeTab === "books"
                    ? "bg-white text-slate-800 hover:bg-amber-50 shadow-md border border-blue-300"
                    : "bg-transparent border-[1px] border-white text-white shadow-lg scale-[0.7] hover:scale-[0.8]"
                }`}
              >
                Books
              </button>
              <button
                onClick={() => setActiveTab("members")}
                className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform whitespace-nowrap ${
                  activeTab === "members"
                    ? "bg-white text-slate-800 hover:bg-amber-50 shadow-md border border-blue-300"
                    : "bg-transparent border-[1px] border-white text-white shadow-lg scale-[0.7] hover:scale-[0.8]"
                }`}
              >
                Members
              </button>
            </div>
          </div>
        </header>

        {/* Modernized alert */}
        {alert.show && (
          <div
            className={`mb-6 p-4 rounded-xl shadow-md transform transition-all duration-300 ${
              alert.type === "success"
                ? "bg-gradient-to-r from-emerald-50 to-teal-50 border-l-4 border-emerald-600 text-emerald-900"
                : "bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-600 text-red-900"
            }`}
          >
            <div className="flex items-center">
              <span className="font-medium">{alert.message}</span>
            </div>
          </div>
        )}

        {/* Books Tab */}
        {activeTab === "books" && (
          <div className="space-y-6">
            {/* Statistics in modern cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-blue-950 rounded-2xl shadow-lg p-3 text-white transform  transition-transform">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium mb-1">
                      Total Books
                    </p>
                    <p className="text-4xl font-bold">{books.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-blue-950 rounded-2xl shadow-lg p-3 text-white transform transition-transform">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium mb-1">
                      Total Copies
                    </p>
                    <p className="text-4xl font-bold">{totalBooksCopies}</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-950 rounded-2xl shadow-lg p-3 text-white transform  transition-transform">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium mb-1">
                      Available
                    </p>
                    <p className="text-4xl font-bold">{availableCopies}</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-950 rounded-2xl shadow-lg p-3 text-white transform  transition-transform">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium mb-1">
                      Borrowed
                    </p>
                    <p className="text-4xl font-bold">{borrowedCopies}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Modern form */}
              <div className={`lg:col-span-1 rounded-2xl shadow-lg p-6 border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-gray-100' : 'bg-white border-blue-200 text-gray-900'}`}>
                <div className="flex items-center mb-6">
                  <h2 className="text-2xl font-bold ">
                    {editingBook ? "Edit" : "Add"} a Book
                  </h2>
                </div>

                <form onSubmit={editingBook ? updateBook : addBook} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={bookForm.title}
                      onChange={(e) =>
                        setBookForm({ ...bookForm, title: e.target.value })
                      }
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-white focus:border-white transition-all ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'border-blue-300 bg-white text-gray-900'}`}
                      placeholder="Book title..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Author *
                    </label>
                    <input
                      type="text"
                      value={bookForm.author}
                      onChange={(e) =>
                        setBookForm({ ...bookForm, author: e.target.value })
                      }
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-white focus:border-white transition-all ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'border-blue-300 bg-white text-gray-900'}`}
                      placeholder="Author name..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      ISBN
                    </label>
                    <input
                      type="text"
                      value={bookForm.isbn}
                      onChange={(e) =>
                        setBookForm({ ...bookForm, isbn: e.target.value })
                      }
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-white focus:border-white transition-all ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'border-blue-300 bg-white text-gray-900'}`}
                      placeholder="978-..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Description
                    </label>
                    <textarea
                      value={bookForm.description}
                      onChange={(e) =>
                        setBookForm({
                          ...bookForm,
                          description: e.target.value,
                        })
                      }
                      placeholder="Brief book description..."
                      rows="3"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-white focus:border-white resize-none transition-all ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'border-blue-300 bg-white text-gray-900'}`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Cover Image URL
                    </label>
                    <input
                      type="url"
                      value={bookForm.coverImage}
                      onChange={(e) =>
                        setBookForm({ ...bookForm, coverImage: e.target.value })
                      }
                      placeholder="https://..."
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-white focus:border-white transition-all ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'border-blue-300 bg-white text-gray-900'}`}
                    />
                    {bookForm.coverImage && (
                      <div className="mt-4 flex justify-center">
                        <img
                          src={bookForm.coverImage}
                          alt="Preview"
                          className="w-32 h-48 object-cover rounded-xl shadow-lg border-4 border-blue-100"
                          onError={(e) =>
                            (e.target.src =
                              "https://via.placeholder.com/128x192?text=No+Image")
                          }
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Category
                      </label>
                      <select
                        value={bookForm.category}
                        onChange={(e) =>
                          setBookForm({ ...bookForm, category: e.target.value })
                        }
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-white focus:border-white transition-all ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'border-blue-300 bg-white text-gray-900'}`}
                      >
                        <option>Fiction</option>
                        <option>Non-Fiction</option>
                        <option>Science</option>
                        <option>History</option>
                        <option>Biography</option>
                        <option>Technology</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Copies *
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={bookForm.copies}
                        onChange={(e) =>
                          setBookForm({ ...bookForm, copies: e.target.value })
                        }
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-white focus:border-white transition-all ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'border-blue-300 bg-white text-gray-900'}`}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className='w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all duration-300 transform hover:scale-105 bg-blue-950 border-white border-[1px]'>
                    {editingBook ? "Update Book" : "Add Book"}
                  </button>

                  {editingBook && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingBook(null);
                        setBookForm({
                          title: "",
                          author: "",
                          isbn: "",
                          category: "Fiction",
                          copies: 1,
                          coverImage: "",
                          description: "",
                        });
                      }}
                      className={`w-full py-3 rounded-xl font-semibold transition-all ${isDarkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'}`}
                    >
                      Cancel
                    </button>
                  )}
                </form>
              </div>

              {/* Books list in cards */}
              <div className={`lg:col-span-2 rounded-2xl shadow-lg p-6 border overflow-visible ${isDarkMode ? 'bg-slate-800 border-slate-700 text-gray-100' : 'bg-white border-blue-200 text-gray-900'}`}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold ">Library</h2>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${isDarkMode ? 'bg-slate-700 text-gray-100' : 'bg-blue-100 text-blue-800'}`}>{filteredBooks.length} books</span>
                </div>

                <div className="mb-6">
                  <div className="relative">
                    <input type="text" placeholder="Search for a book..." value={searchBook} onChange={(e) => setSearchBook(e.target.value)} className={`w-full px-6 py-4 pl-12 border-2 rounded-xl focus:ring-2 focus:ring-white focus:border-white transition-all ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-blue-300 text-gray-900'}`}/>
                  </div>
                </div>
                <div className="grid grid-cols-1 p-2 h-full md:grid-cols-2 gap-4 max-h-[880px] overflow-y-auto pr-2 overflow-visible">
                  {filteredBooks.map((book) => {
                    // Calculate available copies properly
                    const totalCopies = book.copies;
                    const isAvailable = totalCopies > 0;
                    
                    return (
                      <div key={book.id} className={`rounded-xl transition-all duration-300 transform hover:-translate-y-1 overflow-visible  border p-4 ${isDarkMode ? 'bg-slate-700 border-slate-600 text-gray-100 shadow-[0_0_5px_#000000]' : 'bg-white border-blue-700 text-gray-900'} `}>
                        <div className="flex gap-4">
                          <img
                            src={
                              book.coverImage ||
                              "https://via.placeholder.com/80x120?text=No+Cover"
                            }
                            alt={book.title}
                            className="w-20 h-28 object-cover rounded-lg shadow-[0_0_5px_#000000]"
                            onError={(e) =>
                              (e.target.src =
                                "https://via.placeholder.com/80x120?text=No+Cover")
                            }
                          />

                          <div className="flex-1 min-w-0">
                            <h3 className={`font-bold text-lg mb-1 truncate ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                              {book.title}
                            </h3>
                            <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              {book.author}
                            </p>

                            <div className="flex items-center gap-2 mb-2">
                              <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${isDarkMode ? 'bg-slate-600 text-gray-200' : 'bg-blue-100 text-blue-800'}`}>
                                {book.category}
                              </span>
                              <span
                                className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                                  isAvailable
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-rose-100 text-rose-700"
                                }`}
                              >
                                {totalCopies} available
                              </span>
                            </div>

                            {book.description && (
                              <p className={`text-xs line-clamp-2 mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {book.description}
                              </p>
                            )}

                            <div className="flex gap-2">
                              <button
                                onClick={() => editBook(book)}
                                className="flex-1 px-3 py-2 bg-blue-950 border-white border-[1px] text-white rounded-lg text-sm font-semibold hover:from-amber-800 hover:to-amber-700 transition-all"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteBook(book.id)}
                                className="px-3 py-2 bg-red-700 text-white rounded-lg text-sm font-semibold hover:bg-red-800 transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {filteredBooks.length === 0 && (
                  <div className="text-center py-12">
                    <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No books found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Members Tab */}
        {activeTab === "members" && (
          <div className="space-y-6">
            {/* Member statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-blue-950 rounded-2xl shadow-lg p-3 text-white transform transition-transform">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-100 text-sm font-medium mb-1">
                      Total Members
                    </p>
                    <p className="text-4xl font-bold">{members.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-blue-950 rounded-2xl shadow-lg p-3 text-white transform  transition-transform">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-100 text-sm font-medium mb-1">
                      Total Admins
                    </p>
                    <p className="text-4xl font-bold">{members.filter(member => member.role === 'admin').length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-blue-950 rounded-2xl shadow-lg p-3 text-white transform  transition-transform">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium mb-1">
                      Active Borrowers
                    </p>
                    <p className="text-4xl font-bold">{activeMembers}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Members list */}
            <div className={`rounded-2xl shadow-lg p-6 overflow-visible border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-gray-100' : 'bg-white border-blue-200 text-gray-900'}`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold ">Members</h2>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${isDarkMode ? 'bg-slate-700 text-gray-100' : 'bg-blue-100 text-blue-800'}`}>
                  {filteredMembers.length} members
                </span>
              </div>

              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for a member..."
                    value={searchMember}
                    onChange={(e) => setSearchMember(e.target.value)}
                    className={`w-full px-6 py-4 pl-12 border-2 rounded-xl focus:ring-2 focus:ring-white focus:border-white transition-all ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-blue-300 text-gray-900'}`}
                  />
                  
                </div>
              </div>

              <div className="grid grid-cols-1 p-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-2 ">
                {filteredMembers.map((member) => (
                  <div key={member.id} className={`rounded-xl transition-all duration-300 transform overflow-visible hover:-translate-y-1 p-5 ${isDarkMode ? 'bg-slate-700 border-slate-600 text-gray-100' : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 text-gray-900'}`} >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold border-[1px] border-white ${member.role==="admin" ? `bg-blue-950 ${isDarkMode ? 'shadow-[0_0_5px_#ffffff]':'shadow-[0_0_5px_#000000]'} `:"bg-gray-500"}`}>
                          {member.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                            {member.username}
                          </h3>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {member.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          History loans total:
                        </span>
                        {member.borrowCount ?(
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${isDarkMode ? 'bg-slate-600 text-gray-200' : 'bg-blue-100 text-blue-800'}`}>
                          {member.borrowCount}
                        </span>
                        ):(
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${isDarkMode ? 'bg-slate-600 text-gray-200' : 'bg-blue-100 text-blue-800'}`}>
                          0
                        </span>
                        )}
                        
                      </div>

                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Role:</span>
                        {editingMember && editingMember.id === member.id ? (
                          <select
                            value={editingMember.role}
                            onChange={(e) =>
                              setEditingMember({
                                ...editingMember,
                                role: e.target.value,
                              })
                            }
                            className="px-3 py-1 border-2 text-black border-blue-400 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="member">Member</option>
                            <option value="admin">Admin</option>
                          </select>
                        ) : (
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold  border-[1px] ${isDarkMode ? 'bg-slate-600 text-gray-200 border-white' : 'bg-blue-100 text-blue-800 border-blue-950'}`}
                          >
                            {member.role === "admin" ? "Admin" : "User"}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {editingMember && editingMember.id === member.id ? (
                        <>
                          <button
                            onClick={async () => {
                              await updateMemberType(
                                editingMember.id,
                                editingMember.role
                              );
                              setEditingMember(null);
                            }}
                            className="flex-1 px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-all"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingMember(null)}
                            className="px-3 py-2 bg-gray-500 text-white rounded-lg text-sm font-semibold hover:bg-gray-600 transition-all"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditingMember(member)}
                            className="flex-1 px-3 py-2 bg-blue-950 border-white border-[1px] text-white rounded-lg text-sm font-semibold hover:bg-blue-800  transition-all"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => deleteMember(member.id)}
                            className="px-3 py-2 bg-red-700 text-white rounded-lg text-sm font-semibold hover:bg-red-800 transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {filteredMembers.length === 0 && (
                <div className="text-center py-12">
                  <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No members found</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}