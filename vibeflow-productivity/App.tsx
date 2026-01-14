
import React, { useState, useEffect } from 'react';
import { User, Category, Task, Theme } from './types';
import { INITIAL_CATEGORIES } from './constants';
import { dbService } from './db';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Sidebar from './components/Sidebar';
import Analytics from './pages/Analytics';
import CalendarView from './pages/CalendarView';
import Settings from './pages/Settings';
import Teams from './pages/Teams';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [theme, setTheme] = useState<Theme>('dark');
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Persistence Loading from Database
  useEffect(() => {
    const initApp = async () => {
      try {
        await dbService.init();
        
        // Check for session in localStorage
        const sessionEmail = localStorage.getItem('vibe_session_email');
        if (sessionEmail) {
          const savedUser = await dbService.getUser(sessionEmail);
          if (savedUser) setUser(savedUser);
        }

        const savedCats = await dbService.getCategories();
        if (savedCats && savedCats.length > 0) {
          setCategories(savedCats);
        } else {
          setCategories(INITIAL_CATEGORIES);
        }

        const savedTasks = await dbService.getTasks();
        if (savedTasks) setTasks(savedTasks);

        const savedTheme = localStorage.getItem('vibe_theme') as Theme;
        if (savedTheme) setTheme(savedTheme);

      } catch (error) {
        console.error("Database initialization failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initApp();
  }, []);

  // Database Sync Effect
  useEffect(() => {
    const syncToDB = async () => {
      if (isLoading) return;
      
      setIsSaving(true);
      try {
        if (user) {
          await dbService.saveUser(user);
          localStorage.setItem('vibe_session_email', user.email);
        }
        await dbService.saveCategories(categories);
        await dbService.saveTasks(tasks);
        localStorage.setItem('vibe_theme', theme);
        
        document.documentElement.classList.toggle('dark', theme === 'dark');
      } catch (error) {
        console.error("Failed to sync to database:", error);
      } finally {
        // Debounce the saving indicator slightly for visual polish
        setTimeout(() => setIsSaving(false), 500);
      }
    };

    syncToDB();
  }, [user, categories, tasks, theme, isLoading]);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('vibe_session_email');
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <div className="w-16 h-16 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-heading font-bold text-xl animate-pulse">Initializing Database...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} theme={theme} toggleTheme={toggleTheme} />;
  }

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-gray-50 text-slate-900'}`}>
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        onLogout={handleLogout} 
        theme={theme} 
        toggleTheme={toggleTheme}
        isSaving={isSaving}
      />
      
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {currentPage === 'dashboard' && (
            <Dashboard 
              user={user} 
              setUser={setUser} 
              categories={categories} 
              tasks={tasks} 
              setTasks={setTasks} 
            />
          )}
          {currentPage === 'analytics' && (
            <Analytics tasks={tasks} categories={categories} />
          )}
          {currentPage === 'calendar' && (
            <CalendarView 
              tasks={tasks} 
              setTasks={setTasks} 
              categories={categories} 
              user={user} 
              setUser={setUser} 
            />
          )}
          {currentPage === 'settings' && (
            <Settings 
              categories={categories} 
              setCategories={setCategories} 
              tasks={tasks} 
              setTasks={setTasks} 
            />
          )}
          {currentPage === 'teams' && (
            <Teams user={user} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
