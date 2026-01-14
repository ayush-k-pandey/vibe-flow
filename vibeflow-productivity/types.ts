
export type Theme = 'light' | 'dark';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  streak: number;
  totalPoints: number;
  lastActive: string;
}

export interface Task {
  id: string;
  categoryId: string;
  name: string;
  points: number;
  icon: string;
  completedDates: string[]; // ISO Strings
  reminder?: {
    time: string;
    frequency: 'daily' | 'weekly';
    enabled: boolean;
  };
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  enabled: boolean;
}

export interface CompletionEntry {
  taskId: string;
  points: number;
  timestamp: string;
}

export interface Team {
  id: string;
  name: string;
  members: User[];
  totalPoints: number;
}
