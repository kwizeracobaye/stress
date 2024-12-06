import { useState, useEffect } from 'react';
import { Lecturer } from '../types/lecturer';
import { getLecturers, saveLecturer, updateLecturer, deleteLecturer, getLecturerByName } from '../services/lecturerService';

export function useLecturers() {
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLecturers();
  }, []);

  async function loadLecturers() {
    try {
      setLoading(true);
      const data = await getLecturers();
      setLecturers(data);
      setError(null);
    } catch (err) {
      setError('Failed to load lecturers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function addLecturer(data: Omit<Lecturer, 'id'>) {
    try {
      const existingLecturer = await getLecturerByName(data.name);
      if (existingLecturer) {
        throw new Error('Lecturer is already checked in');
      }

      const id = await saveLecturer(data);
      setLecturers(prev => [{ ...data, id } as Lecturer, ...prev]);
      return true;
    } catch (err) {
      setError('Failed to add lecturer');
      console.error(err);
      throw err;
    }
  }

  async function editLecturer(id: string, data: Omit<Lecturer, 'id'>) {
    try {
      await updateLecturer(id, data);
      setLecturers(prev => prev.map(item => 
        item.id === id ? { ...data, id } as Lecturer : item
      ));
      return true;
    } catch (err) {
      setError('Failed to update lecturer');
      console.error(err);
      return false;
    }
  }

  async function removeLecturer(id: string) {
    try {
      await deleteLecturer(id);
      setLecturers(prev => prev.filter(item => item.id !== id));
      return true;
    } catch (err) {
      setError('Failed to delete lecturer');
      console.error(err);
      return false;
    }
  }

  async function findLecturerByName(name: string) {
    try {
      return await getLecturerByName(name);
    } catch (err) {
      setError('Failed to find lecturer');
      console.error(err);
      return null;
    }
  }

  return {
    lecturers,
    loading,
    error,
    addLecturer,
    editLecturer,
    removeLecturer,
    findLecturerByName,
    refreshLecturers: loadLecturers
  };
}