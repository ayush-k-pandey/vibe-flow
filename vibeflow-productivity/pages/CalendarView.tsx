
import React, { useState, useMemo } from 'react';
import { Task, Category, User } from '../types';
import { ICON_MAP } from '../constants';
// Added Check to the imports from lucide-react
import { ChevronLeft, ChevronRight, Flame, Trophy, Star, Check, X, History, Zap } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, startOfWeek, endOfWeek, isSameDay, parseISO } from 'date-fns';

interface CalendarViewProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  categories: Category[];
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const CalendarView: React.FC<CalendarViewProps> = ({ tasks, setTasks, categories, user, setUser }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentDate));
    const end = endOfWeek(endOfMonth(currentDate));
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const getPointsForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return tasks.reduce((acc, task) => {
      const completed = task.completedDates.some(d => d.startsWith(dateStr));
      return acc + (completed ? task.points : 0);
    }, 0);
  };

  const toggleTaskForDay = (taskId: string, date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const isCompleted = task.completedDates.some(d => d.startsWith(dateStr));

    let newCompletedDates: string[];
    if (isCompleted) {
      newCompletedDates = task.completedDates.filter(d => !d.startsWith(dateStr));
      setUser(prev => prev ? { ...prev, totalPoints: Math.max(0, prev.totalPoints - task.points) } : null);
    } else {
      // Create an ISO string for the specific historical day
      const historicalDate = new Date(date);
      historicalDate.setHours(12, 0, 0, 0); // Normalize to noon
      newCompletedDates = [...task.completedDates, historicalDate.toISOString()];
      setUser(prev => prev ? { ...prev, totalPoints: prev.totalPoints + task.points } : null);
    }

    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completedDates: newCompletedDates } : t));
  };

  const prevMonth = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  const selectedDayTasks = useMemo(() => {
    if (!selectedDay) return [];
    const dateStr = format(selectedDay, 'yyyy-MM-dd');
    return tasks.map(t => ({
      ...t,
      isCompletedOnDay: t.completedDates.some(d => d.startsWith(dateStr))
    }));
  }, [selectedDay, tasks]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black font-heading">Grind Calendar</h2>
          <p className="text-slate-500">Tap any day to edit past completions.</p>
        </div>
        <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-2">
          <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <ChevronLeft size={24} />
          </button>
          <span className="font-bold text-lg min-w-[140px] text-center">{format(currentDate, 'MMMM yyyy')}</span>
          <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass rounded-[40px] p-8">
          <div className="grid grid-cols-7 gap-4 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="text-center text-xs font-black text-slate-500 uppercase tracking-widest">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {days.map((date, i) => {
              const points = getPointsForDay(date);
              const isCurrentMonth = isSameMonth(date, currentDate);
              const today = isToday(date);
              
              return (
                <button 
                  key={i} 
                  onClick={() => setSelectedDay(date)}
                  className={`aspect-square rounded-2xl border transition-all flex flex-col items-center justify-center p-1 relative group ${
                    isCurrentMonth ? 'bg-white/5' : 'opacity-20 pointer-events-none'
                  } ${today ? 'border-violet-500 ring-2 ring-violet-500/20' : 'border-transparent hover:border-white/20'} ${points > 0 ? 'bg-violet-600/10' : ''}`}
                >
                  <span className={`text-sm font-bold ${today ? 'text-violet-500' : 'text-slate-400'}`}>
                    {format(date, 'd')}
                  </span>
                  {points > 0 && (
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-violet-500 neon-glow"></div>
                  )}
                  {points > 100 && (
                    <div className="absolute top-2 right-2 text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Star size={10} fill="currentColor" />
                    </div>
                  )}
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10">
                    {points} XP Earned
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass p-8 rounded-[40px] border-l-4 border-l-orange-500">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
                <Flame size={28} fill="currentColor" />
              </div>
              <h3 className="text-xl font-bold">Streak Heat</h3>
            </div>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              Consistency is key. Tap on past days to log activity you might have missed!
            </p>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-orange-400 to-rose-500 w-[70%]" />
            </div>
          </div>

          <div className="glass p-8 rounded-[40px] border-l-4 border-l-yellow-500">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 text-yellow-500 flex items-center justify-center">
                <Trophy size={28} fill="currentColor" />
              </div>
              <h3 className="text-xl font-bold">Milestones</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500">
                  <Star size={14} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold">Perfect Week</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest">In Progress (4/7)</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <Check size={14} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold">Century Grinder</p>
                  <p className="text-[10px] text-emerald-500 uppercase tracking-widest font-black">Unlocked! ✨</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Day Modal */}
      {selectedDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="glass w-full max-w-lg p-8 rounded-[40px] border border-white/20 shadow-2xl relative max-h-[90vh] flex flex-col">
            <button onClick={() => setSelectedDay(null)} className="absolute top-8 right-8 text-slate-400 hover:text-white">
              <X size={24} />
            </button>
            
            <div className="mb-8">
              <div className="flex items-center gap-3 text-violet-500 mb-2">
                <History size={20} />
                <span className="font-black text-sm uppercase tracking-widest">Edit History</span>
              </div>
              <h3 className="text-3xl font-black font-heading">{format(selectedDay, 'EEEE, MMM do')}</h3>
              <p className="text-slate-500 text-sm">Toggle tasks completed on this day.</p>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-6 no-scrollbar">
              {categories.map(cat => {
                const catTasks = selectedDayTasks.filter(t => t.categoryId === cat.id);
                if (catTasks.length === 0) return null;
                return (
                  <div key={cat.id} className="space-y-3">
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }}></span>
                      {cat.name}
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {catTasks.map(task => (
                        <button
                          key={task.id}
                          onClick={() => toggleTaskForDay(task.id, selectedDay)}
                          className={`flex items-center justify-between p-4 rounded-2xl transition-all border-2 ${
                            task.isCompletedOnDay 
                              ? 'bg-emerald-500/10 border-emerald-500/40 text-white' 
                              : 'bg-white/5 border-transparent hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl ${task.isCompletedOnDay ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                              {ICON_MAP[task.icon] || <Zap size={16} />}
                            </div>
                            <div className="text-left">
                              <p className="font-bold text-sm">{task.name}</p>
                              <p className="text-[10px] opacity-60 font-bold">{task.points} XP</p>
                            </div>
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            task.isCompletedOnDay ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-700'
                          }`}>
                            {task.isCompletedOnDay && <Check size={14} />}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <button 
              onClick={() => setSelectedDay(null)} 
              className="mt-8 w-full py-4 bg-violet-600 text-white font-black text-lg rounded-2xl hover:bg-violet-700 transition-all"
            >
              DONE
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
