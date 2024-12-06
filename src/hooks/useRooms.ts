import { useState, useEffect } from 'react';
import { Room } from '../types/room';
import { getRooms, saveRoom, updateRoom, deleteRoom, getRoomByNumber } from '../services/roomService';

export function useRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRooms();
  }, []);

  async function loadRooms() {
    try {
      setLoading(true);
      const data = await getRooms();
      setRooms(data);
      setError(null);
    } catch (err) {
      setError('Failed to load rooms');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function addRoom(room: Omit<Room, 'id'>) {
    try {
      const existingRoom = await getRoomByNumber(room.number);
      if (existingRoom) {
        throw new Error('Room already exists');
      }

      const id = await saveRoom(room);
      setRooms(prev => [...prev, { ...room, id }]);
      return true;
    } catch (err) {
      setError('Failed to add room');
      console.error(err);
      throw err;
    }
  }

  async function editRoom(id: string, room: Omit<Room, 'id'>) {
    try {
      await updateRoom(id, room);
      setRooms(prev => prev.map(item => 
        item.id === id ? { ...room, id } : item
      ));
      return true;
    } catch (err) {
      setError('Failed to update room');
      console.error(err);
      return false;
    }
  }

  async function removeRoom(id: string) {
    try {
      await deleteRoom(id);
      setRooms(prev => prev.filter(item => item.id !== id));
      return true;
    } catch (err) {
      setError('Failed to delete room');
      console.error(err);
      return false;
    }
  }

  return {
    rooms,
    loading,
    error,
    addRoom,
    editRoom,
    removeRoom,
    refreshRooms: loadRooms
  };
}