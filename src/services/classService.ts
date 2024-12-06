import { collection, addDoc, getDocs, query, where, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { ClassInfo } from '../types/class';

const COLLECTION_NAME = 'classes';

export async function saveClass(classInfo: Omit<ClassInfo, 'id'>): Promise<string> {
  try {
    const classesRef = collection(db, COLLECTION_NAME);
    const docRef = await addDoc(classesRef, classInfo);
    return docRef.id;
  } catch (error) {
    console.error('Error saving class:', error);
    throw error;
  }
}

export async function getClasses(): Promise<ClassInfo[]> {
  try {
    const classesRef = collection(db, COLLECTION_NAME);
    const querySnapshot = await getDocs(classesRef);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ClassInfo));
  } catch (error) {
    console.error('Error getting classes:', error);
    throw error;
  }
}

export async function updateClass(id: string, classInfo: Omit<ClassInfo, 'id'>): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, classInfo);
  } catch (error) {
    console.error('Error updating class:', error);
    throw error;
  }
}

export async function deleteClass(id: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting class:', error);
    throw error;
  }
}