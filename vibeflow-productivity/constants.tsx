
import React from 'react';
import { Book, Code, Dumbbell, Gamepad2, GraduationCap, Zap, Music, Camera, Heart, Briefcase } from 'lucide-react';

export const INITIAL_CATEGORIES = [
  { id: 'cat-1', name: 'Study', icon: 'GraduationCap', color: '#8B5CF6', enabled: true },
  { id: 'cat-2', name: 'Skills', icon: 'Code', color: '#10B981', enabled: true },
  { id: 'cat-3', name: 'Physical', icon: 'Dumbbell', color: '#F43F5E', enabled: true },
  { id: 'cat-4', name: 'Fun', icon: 'Gamepad2', color: '#F59E0B', enabled: true },
];

export const ICON_MAP: Record<string, React.ReactNode> = {
  GraduationCap: <GraduationCap size={20} />,
  Code: <Code size={20} />,
  Dumbbell: <Dumbbell size={20} />,
  Gamepad2: <Gamepad2 size={20} />,
  Book: <Book size={20} />,
  Zap: <Zap size={20} />,
  Music: <Music size={20} />,
  Camera: <Camera size={20} />,
  Heart: <Heart size={20} />,
  Briefcase: <Briefcase size={20} />,
};

export const COLOR_OPTIONS = [
  '#8B5CF6', // Violet
  '#10B981', // Emerald
  '#F43F5E', // Rose
  '#F59E0B', // Amber
  '#3B82F6', // Blue
  '#EC4899', // Pink
  '#06B6D4', // Cyan
];
