import { db, auth } from "@/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  Timestamp,
  increment,
  arrayUnion,
} from "firebase/firestore";

// ✅ Fetch all books
export const fetchBooks = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "books"));
    const booksData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return booksData;
  } catch (error) {
    console.error("Error loading books:", error);
    throw error;
  }
};

// ✅ Fetch borrowed books for a specific member
export const fetchMemberBorrowedBooks = async (userId) => {
  try {
    const memberRef = doc(db, "members", userId);
    const memberSnap = await getDoc(memberRef);

    if (!memberSnap.exists()) {
      console.log("Member profile not found");
      return [];
    }

    const memberData = memberSnap.data();
    return memberData.borrowedBooks || [];
  } catch (error) {
    console.error("Error fetching borrowed books:", error);
    throw error;
  }
};

// ✅ Borrow a book
export const borrowBook = async (bookId) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("You must be logged in to borrow books");
    }

    const bookRef = doc(db, "books", bookId);
    const memberRef = doc(db, "members", user.uid);

    // Get the book data
    const bookSnap = await getDoc(bookRef);
    if (!bookSnap.exists()) {
      throw new Error("Book not found");
    }

    const bookData = bookSnap.data();
    if (!bookData.copies || bookData.copies <= 0) {
      throw new Error("No copies available");
    }

    // Get the member data
    const memberSnap = await getDoc(memberRef);
    if (!memberSnap.exists()) {
      throw new Error("Member profile not found");
    }

    // Update both documents in parallel
    await Promise.all([
      // Update book: decrease copies
      updateDoc(bookRef, {
        copies: bookData.copies - 1,
      }),

      // Update member: increment borrowCount and add to borrowedBooks array
      updateDoc(memberRef, {
        borrowCount: increment(1),
        borrowedBooks: arrayUnion({
          bookId: bookId,
          borrowedAt: new Date().toISOString(),
          title: bookData.title,
        }),
      }),
    ]);

    console.log("✅ Book borrowed successfully");
    return { success: true };
  } catch (error) {
    console.error("❌ Error borrowing book:", error);
    throw error;
  }
};

// ✅ Return a book
export const returnBook = async (bookId) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("You must be logged in to return books");
    }

    const bookRef = doc(db, "books", bookId);
    const memberRef = doc(db, "members", user.uid);

    // Get both documents
    const [bookSnap, memberSnap] = await Promise.all([
      getDoc(bookRef),
      getDoc(memberRef),
    ]);

    if (!bookSnap.exists()) {
      throw new Error("Book not found");
    }

    if (!memberSnap.exists()) {
      throw new Error("Member profile not found");
    }

    const bookData = bookSnap.data();
    const memberData = memberSnap.data();

    // Make sure the book is in the member's borrowed books
    const hasBorrowed = memberData.borrowedBooks?.some(
      (book) => book.bookId === bookId
    );
    if (!hasBorrowed) {
      throw new Error("This book was not borrowed by you");
    }

    // Update both documents in parallel
    await Promise.all([
      // Update book: increase copies
      updateDoc(bookRef, {
        copies: (bookData.copies || 0) + 1,
      }),

      // Update member: remove from borrowedBooks array
      updateDoc(memberRef, {
        borrowedBooks: memberData.borrowedBooks.filter(
          (book) => book.bookId !== bookId
        ),
      }),
    ]);

    console.log("✅ Book returned successfully");
    return { success: true };
  } catch (error) {
    console.error("❌ Error returning book:", error);
    throw error;
  }
};
