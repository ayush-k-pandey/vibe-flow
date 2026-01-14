
import React, { useState } from 'react';
import { Category, Task } from '../types';
import { ICON_MAP, COLOR_OPTIONS } from '../constants';
import { Plus, Trash2, Edit3, X, Check, Bell, Clock } from 'lucide-react';

interface SettingsProps {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const Settings: React.FC<SettingsProps> = ({ categories, setCategories, tasks, setTasks }) => {
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState({ name: '', points: 50, icon: 'Zap', categoryId: categories[0]?.id || '' });
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCat, setNewCat] = useState({ name: '', color: COLOR_OPTIONS[0], icon: 'Zap' });

  const addTask = () => {
    if (!newTask.name) return;
    const t: Task = {
      id: Math.random().toString(36).substr(2, 9),
      categoryId: newTask.categoryId,
      name: newTask.name,
      points: newTask.points,
      icon: newTask.icon,
      completedDates: []
    };
    setTasks([...tasks, t]);
    setNewTask({ ...newTask, name: '' });
    setIsAddingTask(false);
  };

  const addCategory = () => {
    if (!newCat.name) return;
    const c: Category = {
      id: Math.random().toString(36).substr(2, 9),
      name: newCat.name,
      icon: newCat.icon,
      color: newCat.color,
      enabled: true
    };
    setCategories([...categories, c]);
    setNewCat({ ...newCat, name: '' });
    setIsAddingCategory(false);
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const removeCategory = (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
    setTasks(tasks.filter(t => t.categoryId !== id));
  };

  const toggleCategory = (id: string) => {
    setCategories(categories.map(c => c.id === id ? { ...c, enabled: !c.enabled } : c));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black font-heading">Customize Your Grind</h2>
          <p className="text-slate-500">Configure tasks, categories, and reminders.</p>
        </div>
        <div className="flex gap-4">
           <button 
            onClick={() => setIsAddingCategory(true)}
            className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-2 font-bold hover:bg-white/10 transition-all"
          >
            <Plus size={20} /> New Category
          </button>
          <button 
            onClick={() => setIsAddingTask(true)}
            className="px-6 py-3 bg-violet-600 rounded-2xl flex items-center gap-2 font-bold hover:bg-violet-700 transition-all text-white neon-glow"
          >
            <Plus size={20} /> New Task
          </button>
        </div>
      </div>

      {/* Categories Management */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map(cat => (
          <div key={cat.id} className={`glass p-6 rounded-3xl border-2 transition-all ${cat.enabled ? 'border-transparent' : 'opacity-40 grayscale border-slate-800'}`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white"
                  style={{ backgroundColor: cat.color }}
                >
                  {ICON_MAP[cat.icon]}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{cat.name}</h3>
                  <p className="text-xs text-slate-500 uppercase tracking-widest">{tasks.filter(t => t.categoryId === cat.id).length} Tasks</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => toggleCategory(cat.id)}
                  className={`p-2 rounded-xl transition-colors ${cat.enabled ? 'text-emerald-500 bg-emerald-500/10' : 'text-slate-500 bg-slate-800'}`}
                >
                  {cat.enabled ? <Check size={18} /> : <X size={18} />}
                </button>
                <button onClick={() => removeCategory(cat.id)} className="p-2 text-rose-500 bg-rose-500/10 rounded-xl hover:bg-rose-500/20 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {tasks.filter(t => t.categoryId === cat.id).map(task => (
                <div key={task.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl group">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400">{ICON_MAP[task.icon]}</span>
                    <div>
                      <p className="font-semibold">{task.name}</p>
                      <p className="text-xs text-violet-400">{task.points} pts</p>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-slate-400 hover:text-white transition-colors">
                      <Clock size={16} />
                    </button>
                    <button onClick={() => removeTask(task.id)} className="p-2 text-rose-500 hover:text-rose-400 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add Task Modal */}
      {isAddingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="glass w-full max-w-lg p-8 rounded-[40px] border border-white/20 shadow-2xl relative">
            <button onClick={() => setIsAddingTask(false)} className="absolute top-8 right-8 text-slate-400 hover:text-white">
              <X size={24} />
            </button>
            <h3 className="text-3xl font-black font-heading mb-8">Add New Task</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Task Name</label>
                <input 
                  type="text" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-violet-500 transition-all"
                  placeholder="e.g. Meditate for 10 mins"
                  value={newTask.name}
                  onChange={(e) => setNewTask({...newTask, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Points (XP)</label>
                  <input 
                    type="number" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-violet-500 transition-all"
                    value={newTask.points}
                    onChange={(e) => setNewTask({...newTask, points: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Category</label>
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-violet-500 transition-all appearance-none"
                    value={newTask.categoryId}
                    onChange={(e) => setNewTask({...newTask, categoryId: e.target.value})}
                  >
                    {categories.map(c => <option key={c.id} value={c.id} className="bg-slate-900">{c.name}</option>)}
                  </select>
                </div>
              </div>
              <button onClick={addTask} className="w-full py-5 bg-violet-600 text-white font-black text-lg rounded-3xl hover:bg-violet-700 transition-all shadow-xl shadow-violet-600/20">
                SAVE TASK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {isAddingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="glass w-full max-w-lg p-8 rounded-[40px] border border-white/20 shadow-2xl relative">
            <button onClick={() => setIsAddingCategory(false)} className="absolute top-8 right-8 text-slate-400 hover:text-white">
              <X size={24} />
            </button>
            <h3 className="text-3xl font-black font-heading mb-8">Create Category</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Category Name</label>
                <input 
                  type="text" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-violet-500 transition-all"
                  placeholder="e.g. Side Hustle"
                  value={newCat.name}
                  onChange={(e) => setNewCat({...newCat, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Theme Color</label>
                <div className="flex flex-wrap gap-3">
                  {COLOR_OPTIONS.map(color => (
                    <button 
                      key={color}
                      onClick={() => setNewCat({...newCat, color})}
                      className={`w-10 h-10 rounded-full border-4 transition-transform ${newCat.color === color ? 'border-white scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <button onClick={addCategory} className="w-full py-5 bg-violet-600 text-white font-black text-lg rounded-3xl hover:bg-violet-700 transition-all shadow-xl shadow-violet-600/20">
                CREATE CATEGORY
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
