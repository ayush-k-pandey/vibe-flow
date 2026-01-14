
import { User, Task, Category } from './types';

const DB_NAME = 'VibeFlowDB';
const DB_VERSION = 1;

export class VibeFlowDB {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('users')) {
          db.createObjectStore('users', { keyPath: 'email' });
        }
        if (!db.objectStoreNames.contains('tasks')) {
          db.createObjectStore('tasks', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('categories')) {
          db.createObjectStore('categories', { keyPath: 'id' });
        }
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onerror = () => reject('Failed to open database');
    });
  }

  private getStore(storeName: string, mode: IDBTransactionMode = 'readonly') {
    if (!this.db) throw new Error('Database not initialized');
    const transaction = this.db.transaction(storeName, mode);
    return transaction.objectStore(storeName);
  }

  // User Operations
  async saveUser(user: User): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.getStore('users', 'readwrite');
      const request = store.put(user);
      request.onsuccess = () => resolve();
      request.onerror = () => reject('Failed to save user');
    });
  }

  async getUser(email: string): Promise<User | null> {
    return new Promise((resolve, reject) => {
      const store = this.getStore('users');
      const request = store.get(email);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject('Failed to get user');
    });
  }

  // Task Operations
  async saveTasks(tasks: Task[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction('tasks', 'readwrite');
      const store = transaction.objectStore('tasks');
      
      // Clear and rewrite for simplicity in this demo sync
      store.clear();
      tasks.forEach(task => store.put(task));
      
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject('Failed to save tasks');
    });
  }

  async getTasks(): Promise<Task[]> {
    return new Promise((resolve, reject) => {
      const store = this.getStore('tasks');
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject('Failed to get tasks');
    });
  }

  // Category Operations
  async saveCategories(categories: Category[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction('categories', 'readwrite');
      const store = transaction.objectStore('categories');
      store.clear();
      categories.forEach(cat => store.put(cat));
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject('Failed to save categories');
    });
  }

  async getCategories(): Promise<Category[]> {
    return new Promise((resolve, reject) => {
      const store = this.getStore('categories');
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject('Failed to get categories');
    });
  }
}

export const dbService = new VibeFlowDB();
