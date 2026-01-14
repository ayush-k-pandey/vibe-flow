
import React, { useState, useMemo } from 'react';
import { User, Category, Task } from '../types';
import { ICON_MAP } from '../constants';
import { Plus, Check, Trophy, Flame, Target, TrendingUp } from 'lucide-react';
import confetti from 'https://cdn.skypack.dev/canvas-confetti';

interface DashboardProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  categories: Category[];
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const Dashboard: React.FC<DashboardProps> = ({ user, setUser, categories, tasks, setTasks }) => {
  const [selectedCatId, setSelectedCatId] = useState<string>(categories[0]?.id || '');

  const todayStr = new Date().toISOString().split('T')[0];

  const dailyPoints = useMemo(() => {
    return tasks.reduce((acc, task) => {
      const completedToday = task.completedDates.some(d => d.startsWith(todayStr));
      return acc + (completedToday ? task.points : 0);
    }, 0);
  }, [tasks, todayStr]);

  const handleTaskToggle = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const isCompleted = task.completedDates.some(d => d.startsWith(todayStr));
    
    let newCompletedDates: string[];
    if (isCompleted) {
      newCompletedDates = task.completedDates.filter(d => !d.startsWith(todayStr));
      setUser(prev => prev ? { ...prev, totalPoints: Math.max(0, prev.totalPoints - task.points) } : null);
    } else {
      newCompletedDates = [...task.completedDates, new Date().toISOString()];
      setUser(prev => prev ? { ...prev, totalPoints: prev.totalPoints + task.points } : null);
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8B5CF6', '#10B981', '#F43F5E']
      });

      // Notification logic (Mock)
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(`VibeFlow: Task Complete!`, {
          body: `You just earned ${task.points} points. Keep the flow!`,
          icon: '/favicon.ico'
        });
      }
    }

    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completedDates: newCompletedDates } : t));
  };

  const activeCategories = categories.filter(c => c.enabled);
  const filteredTasks = tasks.filter(t => t.categoryId === selectedCatId);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Stats */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 glass p-8 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
            <TrendingUp size={120} />
          </div>
          <p className="text-slate-400 font-medium mb-1 uppercase tracking-wider text-xs">Today's Vibe Score</p>
          <h2 className="text-5xl font-black font-heading text-violet-500">{dailyPoints}</h2>
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
            <span className="text-emerald-500 font-bold">+12%</span> from yesterday
          </div>
        </div>

        <div className="flex-1 glass p-8 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
            <Flame size={120} className="text-orange-500" />
          </div>
          <p className="text-slate-400 font-medium mb-1 uppercase tracking-wider text-xs">Flow Streak</p>
          <h2 className="text-5xl font-black font-heading text-orange-500">{user.streak} Days</h2>
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
            Next milestone: <span className="font-bold text-slate-300">7 Days</span>
          </div>
        </div>

        <div className="flex-1 glass p-8 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
            <Trophy size={120} className="text-yellow-500" />
          </div>
          <p className="text-slate-400 font-medium mb-1 uppercase tracking-wider text-xs">Total XP</p>
          <h2 className="text-5xl font-black font-heading text-yellow-500">{user.totalPoints}</h2>
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
            Level 12 <span className="text-slate-600">|</span> 800xp to Level 13
          </div>
        </div>
      </div>

      {/* Categories Selector */}
      <div className="flex overflow-x-auto gap-4 pb-2 no-scrollbar">
        {activeCategories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCatId(cat.id)}
            className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all whitespace-nowrap border ${
              selectedCatId === cat.id 
                ? `bg-white/10 border-white/20 shadow-lg scale-105` 
                : 'border-transparent hover:bg-white/5'
            }`}
          >
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
              style={{ backgroundColor: cat.color }}
            >
              {ICON_MAP[cat.icon]}
            </div>
            <span className="font-bold">{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => {
            const isCompleted = task.completedDates.some(d => d.startsWith(todayStr));
            return (
              <button
                key={task.id}
                onClick={() => handleTaskToggle(task.id)}
                className={`group glass p-6 rounded-3xl border-2 transition-all flex items-center justify-between text-left ${
                  isCompleted ? 'border-emerald-500 bg-emerald-500/10' : 'border-transparent hover:border-violet-500/30'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                    isCompleted ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400 group-hover:bg-violet-600 group-hover:text-white'
                  }`}>
                    {ICON_MAP[task.icon] || <Target size={22} />}
                  </div>
                  <div>
                    <h3 className={`font-bold text-lg ${isCompleted ? 'line-through opacity-50' : ''}`}>
                      {task.name}
                    </h3>
                    <p className="text-sm font-semibold text-slate-500">{task.points} Points</p>
                  </div>
                </div>
                
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                  isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-700'
                }`}>
                  {isCompleted && <Check size={18} />}
                </div>
              </button>
            );
          })
        ) : (
          <div className="col-span-full py-20 text-center glass rounded-3xl">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
              <Plus size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">No tasks in this vibe yet</h3>
            <p className="text-slate-500">Head over to Settings to customize your grind.</p>
          </div>
        )}
      </div>

      {/* Quick Reminder Tip */}
      <div className="bg-gradient-to-r from-violet-600/20 to-pink-600/20 p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h4 className="text-xl font-bold mb-1">Weekly Challenge: Sprint Legend 🏃</h4>
          <p className="text-slate-400">Complete at least 5 physical tasks this week to earn a limited edition badge.</p>
        </div>
        <button className="px-8 py-3 bg-white text-slate-900 font-bold rounded-2xl hover:bg-violet-100 transition-colors shrink-0">
          Accept Challenge
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
