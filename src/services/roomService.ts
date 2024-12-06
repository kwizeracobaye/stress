import { collection, getDocs, query, where, updateDoc, doc, addDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Room } from '../types/room';

const COLLECTION_NAME = 'rooms';

export async function saveRoom(room: Omit<Room, 'id'>): Promise<string> {
  try {
    const roomsRef = collection(db, COLLECTION_NAME);
    const docRef = await addDoc(roomsRef, room);
    return docRef.id;
  } catch (error) {
    console.error('Error saving room:', error);
    throw error;
  }
}

export async function getRooms(): Promise<Room[]> {
  try {
    const roomsRef = collection(db, COLLECTION_NAME);
    const querySnapshot = await getDocs(roomsRef);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Room));
  } catch (error) {
    console.error('Error getting rooms:', error);
    throw error;
  }
}

export async function updateRoom(id: string, room: Omit<Room, 'id'>): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, room);
  } catch (error) {
    console.error('Error updating room:', error);
    throw error;
  }
}

export async function deleteRoom(id: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting room:', error);
    throw error;
  }
}

export async function getRoomByNumber(number: string): Promise<Room | null> {
  try {
    const roomsRef = collection(db, COLLECTION_NAME);
    const q = query(roomsRef, where('number', '==', number));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Room;
  } catch (error) {
    console.error('Error getting room by number:', error);
    throw error;
  }
}