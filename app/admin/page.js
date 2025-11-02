// admin/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth,db } from "@/lib/firebase";
import { signOut } from "firebase/auth";
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

export default function Home() {
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
 const handleSignOut = async () => {
  try {
    await signOut(auth);
    setUser(null);
    window.location.href = "/"; // 👈 AJOUT - Redirection vers home
  } catch (error) {
    console.error("Error signing out:", error);
  }
};
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
    setTimeout(
      () => setAlert({ show: false, message: "", type: "success" }),
      4000
    );
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
      showAlert("Erreur lors du chargement des livres", "error");
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
      showAlert("Livre ajouté avec succès! ✅");
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
      showAlert("Erreur lors de l'ajout du livre: " + error.message, "error");
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
      await updateDoc(doc(db, "books", editingBook.id), {
        ...bookForm,
        copies: parseInt(bookForm.copies),
      });
      showAlert("Livre mis à jour avec succès! ✅");
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
      showAlert(
        "Erreur lors de la mise à jour du livre: " + error.message,
        "error"
      );
    }
  };

  const deleteBook = async (bookId) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce livre?")) {
      try {
        await deleteDoc(doc(db, "books", bookId));
        showAlert("Livre supprimé avec succès! ✅");
        loadBooks();
      } catch (error) {
        showAlert("Erreur lors de la suppression: " + error.message, "error");
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
      showAlert("Erreur lors du chargement des membres", "error");
    }
  };

  const updateMemberType = async (memberId, newType) => {
    try {
      await updateDoc(doc(db, "members", memberId), { role: newType });
      showAlert("Type de membre mis à jour ✅");
      loadMembers();
    } catch (error) {
      showAlert("Erreur lors de la mise à jour: " + error.message, "error");
    }
  };

  const deleteMember = async (memberId) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce membre?")) {
      try {
        await deleteDoc(doc(db, "members", memberId));
        showAlert("Membre supprimé avec succès! ✅");
        loadMembers();
      } catch (error) {
        showAlert("Erreur lors de la suppression: " + error.message, "error");
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
      showAlert("Erreur lors du chargement des emprunts", "error");
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
  const availableCopies = books.reduce((sum, book) => sum + book.available, 0);
  const borrowedCopies = totalBooksCopies - availableCopies;
  const activeMembers = members.filter(
    (m) => (m.borrowCount || 0) > 0).length;

  return (
    <div className='min-h-screen bg-gradient-to-br from-stone-100 via-neutral-50 to-stone-200 p-4 md:p-8'>
      <div className='max-w-7xl mx-auto'>
        {/* Header moderne avec gradient gris/marron */}
        <header className='relative overflow-hidden bg-gradient-to-r from-[#1E2D26] via-[#2C4639] to-[#3E6B53] rounded-2xl shadow-xl p-8 mb-8'>
          <div className='absolute inset-0 bg-gradient-to-br from-black/20 to-transparent'></div>
          <div className='relative z-10'>
            <h1 className='text-4xl md:text-5xl font-bold text-stone-50 mb-2 tracking-tight'>
              📚 BiblioTech
            </h1>
          </div>
          <div className='absolute -right-10 -bottom-10 w-40 h-40 bg-stone-400 opacity-10 rounded-full'></div>
        </header>

        {/* Alert modernisé */}
        {alert.show && (
          <div
            className={`mb-6 p-4 rounded-xl shadow-md transform transition-all duration-300 ${
              alert.type === "success"
                ? "bg-gradient-to-r from-emerald-50 to-teal-50 border-l-4 border-emerald-600 text-emerald-900"
                : "bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-600 text-red-900"
            }`}
          >
            <div className='flex items-center'>
              <span className='text-2xl mr-3'>
                {alert.type === "success" ? "✅" : "⚠️"}
              </span>
              <span className='font-medium'>{alert.message}</span>
            </div>
          </div>
        )}

        {/* Tabs modernes */}
        <div className='flex gap-3 mb-8 overflow-x-auto pb-2'>
          <button
            onClick={() => setActiveTab("books")}
            className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 whitespace-nowrap ${
              activeTab === "books"
                ? "bg-gradient-to-r from-[#2B3A29] via-[#3F5D43] to-[#4E7C55] text-stone-50 shadow-lg"
                : "bg-white text-stone-700 hover:bg-stone-50 shadow-md border border-stone-300"
            }`}
          >
            <span className='text-xl mr-2'>📖</span>
            Livres
          </button>
          <button
            onClick={() => setActiveTab("members")}
            className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 whitespace-nowrap ${
              activeTab === "members"
                ? "bg-gradient-to-r from-[#2B3A29] via-[#3F5D43] to-[#4E7C55] text-stone-50 shadow-lg"
                : "bg-white text-stone-700 hover:bg-stone-50 shadow-md border border-stone-300"
            }`}
          >
            <span className='text-xl mr-2'>👥</span>
            Membres
          </button>
        </div>

        {/* Books Tab */}
        {activeTab === "books" && (
          <div className='space-y-6'>
            {/* Statistiques en cartes modernes */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
              <div className='bg-gradient-to-br from-[#2B3A29] via-[#3F5D43] to-[#4E7C55] rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-stone-200 text-sm font-medium mb-1'>
                      Total Livres
                    </p>
                    <p className='text-4xl font-bold'>{totalBooksCopies}</p>
                  </div>
                  <div className='text-5xl opacity-20'>📚</div>
                </div>
              </div>

              <div className='bg-gradient-to-br from-[#2B3A29] via-[#3F5D43] to-[#4E7C55] rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-stone-200 text-sm font-medium mb-1'>
                      Disponibles
                    </p>
                    <p className='text-4xl font-bold'>{availableCopies}</p>
                  </div>
                  <div className='text-5xl opacity-20'>✅</div>
                </div>
              </div>

              <div
                className='bg-gradient-to-br from-[#2B3A29] via-[#3F5D43] to-[#4E7C55]

] rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform'
              >
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-stone-200 text-sm font-medium mb-1'>
                      Empruntés
                    </p>
                    <p className='text-4xl font-bold'>{borrowedCopies}</p>
                  </div>
                  <div className='text-5xl opacity-20'>📖</div>
                </div>
              </div>
            </div>

            <div className='grid lg:grid-cols-3 gap-6'>
              {/* Formulaire moderne */}
              <div className='lg:col-span-1 bg-white rounded-2xl shadow-lg p-6 border border-stone-200'>
                <div className='flex items-center mb-6'>
                  <div className='w-12 h-12 bg-gradient-to-br from-[#2B3A29] via-[#3F5D43] to-[#4E7C55] rounded-xl flex items-center justify-center text-white text-2xl mr-4'>
                    {editingBook ? "✏️" : "➕"}
                  </div>
                  <h2 className='text-2xl font-bold text-stone-800'>
                    {editingBook ? "Modifier" : "Ajouter"} un Livre
                  </h2>
                </div>

                <form
                  onSubmit={editingBook ? updateBook : addBook}
                  className='space-y-4'
                >
                  <div>
                    <label className='block text-sm font-semibold text-stone-700 mb-2'>
                      Titre *
                    </label>
                    <input
                      type='text'
                      value={bookForm.title}
                      onChange={(e) =>
                        setBookForm({ ...bookForm, title: e.target.value })
                      }
                      className='w-full px-4 py-3 border-2 border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-500 focus:border-stone-500 transition-all'
                      placeholder='Le nom du livre...'
                      required
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-semibold text-stone-700 mb-2'>
                      Auteur *
                    </label>
                    <input
                      type='text'
                      value={bookForm.author}
                      onChange={(e) =>
                        setBookForm({ ...bookForm, author: e.target.value })
                      }
                      className='w-full px-4 py-3 border-2 border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-500 focus:border-stone-500 transition-all'
                      placeholder="Nom de l'auteur..."
                      required
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-semibold text-stone-700 mb-2'>
                      ISBN
                    </label>
                    <input
                      type='text'
                      value={bookForm.isbn}
                      onChange={(e) =>
                        setBookForm({ ...bookForm, isbn: e.target.value })
                      }
                      className='w-full px-4 py-3 border-2 border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-500 focus:border-stone-500 transition-all'
                      placeholder='978-...'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-semibold text-stone-700 mb-2'>
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
                      placeholder='Brève description du livre...'
                      rows='3'
                      className='w-full px-4 py-3 border-2 border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-500 focus:border-stone-500 resize-none transition-all'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-semibold text-stone-700 mb-2'>
                      URL du Cover
                    </label>
                    <input
                      type='url'
                      value={bookForm.coverImage}
                      onChange={(e) =>
                        setBookForm({ ...bookForm, coverImage: e.target.value })
                      }
                      placeholder='https://...'
                      className='w-full px-4 py-3 border-2 border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-500 focus:border-stone-500 transition-all'
                    />
                    {bookForm.coverImage && (
                      <div className='mt-4 flex justify-center'>
                        <img
                          src={bookForm.coverImage}
                          alt='Aperçu'
                          className='w-32 h-48 object-cover rounded-xl shadow-lg border-4 border-stone-100'
                          onError={(e) =>
                            (e.target.src =
                              "https://via.placeholder.com/128x192?text=No+Image")
                          }
                        />
                      </div>
                    )}
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-semibold text-stone-700 mb-2'>
                        Catégorie
                      </label>
                      <select
                        value={bookForm.category}
                        onChange={(e) =>
                          setBookForm({ ...bookForm, category: e.target.value })
                        }
                        className='w-full px-4 py-3 border-2 border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-500 focus:border-stone-500 transition-all'
                      >
                        <option>Fiction</option>
                        <option>Non-Fiction</option>
                        <option>Science</option>
                        <option>Histoire</option>
                        <option>Biographie</option>
                        <option>Technologie</option>
                        <option>Autre</option>
                      </select>
                    </div>

                    <div>
                      <label className='block text-sm font-semibold text-stone-700 mb-2'>
                        Exemplaires *
                      </label>
                      <input
                        type='number'
                        min='1'
                        value={bookForm.copies}
                        onChange={(e) =>
                          setBookForm({ ...bookForm, copies: e.target.value })
                        }
                        className='w-full px-4 py-3 border-2 border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-500 focus:border-stone-500 transition-all'
                        required
                      />
                    </div>
                  </div>

                  <button
                    type='submit'
                    className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all duration-300 transform hover:scale-105 ${
                      editingBook
                        ? "bg-gradient-to-r from-[#2B3A29] via-[#3F5D43] to-[#4E7C55] hover:shadow-neutral-400"
                        : "bg-gradient-to-r from-[#2B3A29] via-[#3F5D43] to-[#4E7C55] hover:shadow-stone-400"
                    }`}
                  >
                    {editingBook ? "💾 Mettre à jour" : "➕ Ajouter le livre"}
                  </button>

                  {editingBook && (
                    <button
                      type='button'
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
                      className='w-full py-3 bg-stone-200 text-stone-700 rounded-xl font-semibold hover:bg-stone-300 transition-all'
                    >
                      ❌ Annuler
                    </button>
                  )}
                </form>
              </div>

              {/* Liste des livres en cartes */}
              <div className='lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-stone-200'>
                <div className='flex items-center justify-between mb-6'>
                  <h2 className='text-2xl font-bold text-stone-800'>
                    Bibliothèque
                  </h2>
                  <span className='px-4 py-2 bg-stone-100 text-stone-700 rounded-full text-sm font-semibold'>
                    {filteredBooks.length} livres
                  </span>
                </div>

                <div className='mb-6'>
                  <div className='relative'>
                    <input
                      type='text'
                      placeholder=' Rechercher un livre...'
                      value={searchBook}
                      onChange={(e) => setSearchBook(e.target.value)}
                      className='w-full px-6 py-4 pl-12 border-2 border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-500 focus:border-stone-500 transition-all'
                    />
                    <span className='absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl'>
                      🔍
                    </span>
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2'>
                  {filteredBooks.map((book) => (
                    <div
                      key={book.id}
                      className='bg-gradient-to-br from-stone-50 to-neutral-100 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-stone-200 p-4'
                    >
                      <div className='flex gap-4'>
                        <img
                          src={
                            book.coverImage ||
                            "https://via.placeholder.com/80x120?text=No+Cover"
                          }
                          alt={book.title}
                          className='w-20 h-28 object-cover rounded-lg shadow-md'
                          onError={(e) =>
                            (e.target.src =
                              "https://via.placeholder.com/80x120?text=No+Cover")
                          }
                        />

                        <div className='flex-1 min-w-0'>
                          <h3 className='font-bold text-stone-800 text-lg mb-1 truncate'>
                            {book.title}
                          </h3>
                          <p className='text-stone-600 text-sm mb-2'>
                            {book.author}
                          </p>

                          <div className='flex items-center gap-2 mb-2'>
                            <span className='px-2 py-1 bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold'>
                              {book.category}
                            </span>
                            <span
                              className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                                book.available > 0
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-rose-100 text-rose-700"
                              }`}
                            >
                              {book.available > 0
                                ? `✓ ${book.available} dispo`
                                : "✗ Emprunté"}
                            </span>
                          </div>

                          {book.description && (
                            <p className='text-stone-500 text-xs line-clamp-2 mb-3'>
                              {book.description}
                            </p>
                          )}

                          <div className='flex gap-2'>
                            <button
                              onClick={() => editBook(book)}
                              className='px-3 py-2 bg-[#3F5D43] text-white rounded-lg text-sm font-semibold hover:bg-[#2B3A29] transition-all shadow-md hover:shadow-lg'
                            >
                              ✏️ Modifier
                            </button>
                            <button
                              onClick={() => deleteBook(book.id)}
                              className='px-3 py-2 bg-[#3F5D43] text-white rounded-lg text-sm font-semibold hover:bg-[#2B3A29] transition-all shadow-md hover:shadow-lg'
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredBooks.length === 0 && (
                  <div className='text-center py-12'>
                    <div className='text-6xl mb-4'>📚</div>
                    <p className='text-stone-500 text-lg'>Aucun livre trouvé</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Members Tab */}
        {activeTab === "members" && (
          <div className='space-y-6'>
            {/* Statistiques membres */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
              <div className='bg-gradient-to-br from-[#2B3A29] via-[#3F5D43] to-[#4E7C55] rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-stone-200 text-sm font-medium mb-1'>
                      Total Membres
                    </p>
                    <p className='text-4xl font-bold'>{members.length}</p>
                  </div>
                  <div className='text-5xl opacity-20'></div>
                </div>
              </div>

              <div className='bg-gradient-to-br from-[#2B3A29] via-[#3F5D43] to-[#4E7C55] rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-stone-200 text-sm font-medium mb-1'>
                      Emprunteurs Actifs
                    </p>
                    <p className='text-4xl font-bold'>{activeMembers}</p>
                  </div>
                  <div className='text-5xl opacity-20'></div>
                </div>
              </div>
            </div>

            {/* Liste des membres */}
            <div className='bg-white rounded-2xl shadow-lg p-6 border border-stone-200'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-2xl font-bold text-stone-800'>Membres</h2>
                <span className='px-4 py-2 bg-stone-100 text-stone-700 rounded-full text-sm font-semibold'>
                  {filteredMembers.length} membres
                </span>
              </div>

              <div className='mb-6'>
                <div className='relative'>
                  <input
                    type='text'
                    placeholder=' Rechercher un membre...'
                    value={searchMember}
                    onChange={(e) => setSearchMember(e.target.value)}
                    className='w-full px-6 py-4 pl-12 border-2 border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-500 focus:border-stone-500 transition-all'
                  />
                  <span className='absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl'>
                    🔍
                  </span>
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-2'>
                {filteredMembers.map((member) => (
                  <div
                    key={member.id}
                    className='bg-gradient-to-br from-stone-50 to-neutral-100 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-stone-200 p-5'
                  >
                    <div className='flex items-start justify-between mb-3'>
                      <div className='flex items-center gap-3'>
                        <div className='w-12 h-12 bg-gradient-to-brfrom-[#d2b48c] via-[#b99976] to-[#8b6b4a]rounded-full flex items-center justify-center text-white text-xl font-bold'>
                          {member.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className='font-bold text-stone-800 text-lg'>
                            {member.username}
                          </h3>
                          <p className='text-stone-500 text-sm'>
                            {member.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className='space-y-2 mb-4'>
                      <div className='flex items-center justify-between'>
                        <span className='text-stone-600 text-sm'>
                          Emprunts actifs:
                        </span>
                        <span className='px-3 py-1 bg-stone-200 text-stone-700 rounded-full text-sm font-semibold'>
                          {member.borrowCount}
                        </span>
                      </div>

                      <div className='flex items-center justify-between'>
                        <span className='text-stone-600 text-sm'>Role:</span>
                        {editingMember && editingMember.id === member.id ? (
                          <select
                            value={editingMember.role}
                            onChange={(e) =>
                              setEditingMember({
                                ...editingMember,
                                role: e.target.value,
                              })
                            }
                            className='px-3 py-1 border-2 border-stone-400 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-stone-500'
                          >
                            <option value='member'>👤 member</option>
                            <option value='admin'>👑 Admin</option>
                          </select>
                        ) : (
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              member.role === "admin"
                                ? "bg-neutral-200 text-neutral-800"
                                : "bg-stone-200 text-stone-700"
                            }`}
                          >
                            {member.role === "admin" ? "👑 Admin" : "👤 User"}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className='flex gap-2'>
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
                            className='flex-1 px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-all'
                          >
                            ✓ Enregistrer
                          </button>
                          <button
                            onClick={() => setEditingMember(null)}
                            className='px-3 py-2 bg-stone-400 text-white rounded-lg text-sm font-semibold hover:bg-stone-500 transition-all'
                          >
                            ✗
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditingMember(member)}
                            className='flex-1 px-3 py-2 bg-[#4E7C55] text-white rounded-lg text-sm font-semibold hover:bg-[#3F5D43] transition-all'
                          >
                            ✏️ Modifier
                          </button>

                          <button
                            onClick={() => deleteMember(member.id)}
                            className='px-3 py-2 bg-[#3F5D43] text-white rounded-lg text-sm font-semibold hover:bg-[#2B3A29] transition-all shadow-md hover:shadow-lg'
                          >
                            🗑️
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {filteredMembers.length === 0 && (
                <div className='text-center py-12'>
                  <div className='text-6xl mb-4'>👥</div>
                  <p className='text-stone-500 text-lg'>Aucun membre trouvé</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
