import { ClassInfo } from '../types/class';

const STORAGE_KEY = 'classes';

export function saveClass(classInfo: ClassInfo): void {
  const classes = getClasses();
  classes.push(classInfo);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(classes));
}

export function updateClass(id: string, newClass: ClassInfo): void {
  const classes = getClasses();
  const index = classes.findIndex(c => c.id === id);
  if (index !== -1) {
    classes[index] = newClass;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(classes));
  }
}

export function deleteClass(id: string): void {
  const classes = getClasses().filter(c => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(classes));
}

export function getClasses(): ClassInfo[] {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}

export function getClassById(id: string): ClassInfo | undefined {
  const classes = getClasses();
  return classes.find(c => c.id === id);
}