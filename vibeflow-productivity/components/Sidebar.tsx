
import React from 'react';
import { LayoutDashboard, BarChart3, Calendar, Settings, Users, LogOut, Sun, Moon, Zap, CloudCheck, Cloud } from 'lucide-react';
import { Theme } from '../types';

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  onLogout: () => void;
  theme: Theme;
  toggleTheme: () => void;
  isSaving?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, onLogout, theme, toggleTheme, isSaving }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
    { id: 'calendar', label: 'Calendar', icon: <Calendar size={20} /> },
    { id: 'teams', label: 'Squads', icon: <Users size={20} /> },
    { id: 'settings', label: 'Customize', icon: <Settings size={20} /> },
  ];

  return (
    <div className={`w-20 md:w-64 border-r ${theme === 'dark' ? 'border-slate-800 bg-slate-900/50' : 'border-gray-200 bg-white'} h-screen flex flex-col transition-all duration-300`}>
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center text-white neon-glow">
            <Zap size={24} fill="currentColor" />
          </div>
          <span className="hidden md:block font-bold text-xl font-heading tracking-tight">VibeFlow</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
              currentPage === item.id 
                ? 'bg-violet-600 text-white neon-glow' 
                : theme === 'dark' ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-500 hover:bg-gray-100'
            }`}
          >
            {item.icon}
            <span className="hidden md:block font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 space-y-2 border-t border-slate-800/50">
        <div className="px-4 py-2 hidden md:flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
          <span>Database Status</span>
          <div className="flex items-center gap-1.5">
            {isSaving ? (
              <>
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                <span className="text-amber-500">Saving...</span>
              </>
            ) : (
              <>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                <span className="text-emerald-500">Synced</span>
              </>
            )}
          </div>
        </div>

        <button
          onClick={toggleTheme}
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
            theme === 'dark' ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-500 hover:bg-gray-100'
          }`}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          <span className="hidden md:block font-medium">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 text-rose-500 hover:bg-rose-500/10`}
        >
          <LogOut size={20} />
          <span className="hidden md:block font-medium">Log out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
