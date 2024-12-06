import { collection, addDoc, getDocs, query, where, deleteDoc, doc, updateDoc, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Lecturer } from '../types/lecturer';

const COLLECTION_NAME = 'lecturers';

export async function saveLecturer(lecturer: Omit<Lecturer, 'id'>): Promise<string> {
  try {
    const lecturersRef = collection(db, COLLECTION_NAME);
    const docRef = await addDoc(lecturersRef, {
      ...lecturer,
      checkInDate: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving lecturer:', error);
    throw error;
  }
}

export async function getLecturers(): Promise<Lecturer[]> {
  try {
    const lecturersRef = collection(db, COLLECTION_NAME);
    const q = query(lecturersRef, orderBy('checkInDate', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lecturer));
  } catch (error) {
    console.error('Error getting lecturers:', error);
    throw error;
  }
}

export async function updateLecturer(id: string, lecturer: Omit<Lecturer, 'id'>): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, lecturer);
  } catch (error) {
    console.error('Error updating lecturer:', error);
    throw error;
  }
}

export async function deleteLecturer(id: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting lecturer:', error);
    throw error;
  }
}

export async function getLecturerByName(name: string): Promise<Lecturer | null> {
  try {
    const lecturersRef = collection(db, COLLECTION_NAME);
    const q = query(lecturersRef, where('name', '==', name));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Lecturer;
  } catch (error) {
    console.error('Error getting lecturer by name:', error);
    throw error;
  }
}