// lib/booksService.js
import { db } from '@/lib/firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc,  // ✅ Vérifiez que c'est bien importé
  Timestamp 
} from 'firebase/firestore';

// ✅ Récupérer tous les livres
export const fetchBooks = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'books'));
    const booksData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return booksData;
  } catch (error) {
    console.error('Error loading books:', error);
    throw error;
  }
};

// ✅ Emprunter un livre
export const borrowBook = async (bookId) => {
  try {
    const bookRef = doc(db, 'books', bookId);
    const bookSnap = await getDoc(bookRef);
    
    if (!bookSnap.exists()) {
      throw new Error('Livre introuvable');
    }

    const bookData = bookSnap.data();
    
    if (!bookData.copies || bookData.copies <= 0) {
      throw new Error('Aucune copie disponible');
    }

    // Diminuer le nombre de copies
    await updateDoc(bookRef, {
      copies: bookData.copies - 1
    });

    console.log('✅ Livre emprunté avec succès');
    return { success: true };
  } catch (error) {
    console.error('❌ Error borrowing book:', error);
    throw error;
  }
};

// ✅ Retourner un livre
export const returnBook = async (bookId) => {
  try {
    const bookRef = doc(db, 'books', bookId);
    const bookSnap = await getDoc(bookRef);
    
    if (!bookSnap.exists()) {
      throw new Error('Livre introuvable');
    }

    const bookData = bookSnap.data();

    // Augmenter le nombre de copies
    await updateDoc(bookRef, {
      copies: (bookData.copies || 0) + 1
    });

    console.log('✅ Livre retourné avec succès');
    return { success: true };
  } catch (error) {
    console.error('❌ Error returning book:', error);
    throw error;
  }
};