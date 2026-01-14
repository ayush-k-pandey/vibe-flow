
import React, { useState } from 'react';
import { Zap, Mail, Lock, User, ArrowRight, Sun, Moon, Loader2 } from 'lucide-react';
import { User as UserType, Theme } from '../types';
import { dbService } from '../db';

interface LoginPageProps {
  onLogin: (user: UserType) => void;
  theme: Theme;
  toggleTheme: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, theme, toggleTheme }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const existingUser = await dbService.getUser(formData.email);

      if (isLogin) {
        if (!existingUser) {
          setError("User not found. Try signing up!");
          setIsSubmitting(false);
          return;
        }
        // In a real app, we would verify the password hash
        onLogin(existingUser);
      } else {
        if (existingUser) {
          setError("User already exists with this email.");
          setIsSubmitting(false);
          return;
        }
        
        const newUser: UserType = {
          id: Math.random().toString(36).substr(2, 9),
          name: formData.name || 'Power User',
          email: formData.email,
          avatar: `https://picsum.photos/seed/${formData.email}/200`,
          streak: 1,
          totalPoints: 0,
          lastActive: new Date().toISOString()
        };

        await dbService.saveUser(newUser);
        onLogin(newUser);
      }
    } catch (err) {
      setError("Database error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col md:flex-row transition-colors duration-500 ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-gray-50 text-slate-900'}`}>
      {/* Visual Side */}
      <div className="hidden md:flex flex-1 relative overflow-hidden bg-violet-600 items-center justify-center p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-indigo-700 to-fuchsia-800 opacity-90"></div>
        <div className="absolute top-20 left-20 w-64 h-64 bg-cyan-400/20 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-pink-400/20 blur-[100px] rounded-full"></div>
        
        <div className="relative z-10 text-white max-w-lg text-center md:text-left">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-8 border border-white/20 mx-auto md:mx-0">
            <Zap size={32} className="text-white" fill="currentColor" />
          </div>
          <h1 className="text-6xl font-black font-heading leading-tight mb-6">
            OWN YOUR <br />
            <span className="text-cyan-300">FLOW.</span>
          </h1>
          <p className="text-xl text-white/80 leading-relaxed mb-8">
            All your progress is securely synced to our local database. Gamify your life and crush every goal.
          </p>
          <div className="flex gap-4 justify-center md:justify-start">
            <div className="px-4 py-2 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 text-sm font-medium">🛡️ Secure Storage</div>
            <div className="px-4 py-2 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 text-sm font-medium">⚡ Real-time Sync</div>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex flex-col p-8 md:p-24 relative">
        <button onClick={toggleTheme} className="absolute top-8 right-8 p-3 rounded-xl border border-gray-200 dark:border-slate-800 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="max-w-md w-full mx-auto my-auto">
          <div className="md:hidden flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center text-white neon-glow">
              <Zap size={24} fill="currentColor" />
            </div>
            <span className="font-bold text-2xl font-heading">VibeFlow</span>
          </div>

          <h2 className="text-3xl font-bold font-heading mb-2">{isLogin ? 'Welcome Back' : 'Get Started'}</h2>
          <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'} mb-8`}>
            {isLogin ? "Log in to access your secure profile." : "Create your vibe and start tracking."}
          </p>

          {error && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl text-sm font-bold animate-in fade-in zoom-in-95">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-semibold opacity-70 ml-1">Full Name</label>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800 focus-within:border-violet-500' : 'bg-white border-gray-200 focus-within:border-violet-500'} transition-all`}>
                  <User size={18} className="text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Enter your name" 
                    className="bg-transparent border-none outline-none w-full" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-semibold opacity-70 ml-1">Email Address</label>
              <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800 focus-within:border-violet-500' : 'bg-white border-gray-200 focus-within:border-violet-500'} transition-all`}>
                <Mail size={18} className="text-slate-400" />
                <input 
                  type="email" 
                  placeholder="name@vibe.com" 
                  className="bg-transparent border-none outline-none w-full" 
                  required 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold opacity-70 ml-1">Password</label>
              <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800 focus-within:border-violet-500' : 'bg-white border-gray-200 focus-within:border-violet-500'} transition-all`}>
                <Lock size={18} className="text-slate-400" />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="bg-transparent border-none outline-none w-full" 
                  required 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all mt-6 shadow-xl shadow-violet-500/20 group"
            >
              {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : (
                <>
                  {isLogin ? 'Sign In' : 'Join the Flow'}
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm">
            {isLogin ? "Don't have an account?" : "Already a member?"}
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-violet-500 font-bold ml-1 hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
