
import React, { useMemo } from 'react';
import { Task, Category } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { Download, Share2, FileText, Image as ImageIcon, Table as TableIcon } from 'lucide-react';

interface AnalyticsProps {
  tasks: Task[];
  categories: Category[];
}

const Analytics: React.FC<AnalyticsProps> = ({ tasks, categories }) => {
  // Aggregate data for charts
  const weeklyData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();
    return days.map((day, i) => {
      const date = new Date(now);
      date.setDate(now.getDate() - (now.getDay() - i));
      const dateStr = date.toISOString().split('T')[0];
      
      let totalPoints = 0;
      tasks.forEach(task => {
        if (task.completedDates.some(d => d.startsWith(dateStr))) {
          totalPoints += task.points;
        }
      });

      return { name: day, points: totalPoints };
    });
  }, [tasks]);

  const distributionData = useMemo(() => {
    return categories.map(cat => {
      const catTasks = tasks.filter(t => t.categoryId === cat.id);
      const totalPoints = catTasks.reduce((sum, task) => {
        return sum + (task.completedDates.length * task.points);
      }, 0);
      return { name: cat.name, value: totalPoints, color: cat.color };
    }).filter(d => d.value > 0);
  }, [tasks, categories]);

  const downloadReport = (format: 'pdf' | 'csv' | 'image') => {
    alert(`Exporting as ${format.toUpperCase()}... In a production environment, this would generate a detailed file including your charts and task history.`);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-3xl font-black font-heading">Performance Hub</h2>
          <p className="text-slate-500">Deep dive into your productivity trends.</p>
        </div>
        <div className="flex gap-2">
          <div className="flex p-1 glass rounded-2xl">
            <button className="px-4 py-2 bg-violet-600 rounded-xl text-sm font-bold">Week</button>
            <button className="px-4 py-2 hover:bg-white/10 rounded-xl text-sm font-bold transition-colors">Month</button>
          </div>
          <button onClick={() => downloadReport('pdf')} className="p-3 glass rounded-2xl hover:bg-white/10 transition-colors text-violet-500" title="Export Report">
            <Download size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Productivity Bar Chart */}
        <div className="glass p-8 rounded-3xl h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-xl">Weekly Score</h3>
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-xs font-bold rounded-full border border-emerald-500/20">Active Streak</span>
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
                <Bar dataKey="points" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Distribution Pie Chart */}
        <div className="glass p-8 rounded-3xl h-[400px] flex flex-col">
          <h3 className="font-bold text-xl mb-8">Focus Distribution</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Momentum Line Chart */}
        <div className="glass p-8 rounded-3xl h-[400px] col-span-1 lg:col-span-2 flex flex-col">
          <h3 className="font-bold text-xl mb-8">Flow Momentum</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                />
                <Line type="monotone" dataKey="points" stroke="#EC4899" strokeWidth={4} dot={{ r: 6, fill: '#EC4899', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button onClick={() => downloadReport('pdf')} className="p-6 glass rounded-3xl flex flex-col items-center gap-3 hover:bg-white/10 transition-all border-2 border-transparent hover:border-violet-500/50">
          <FileText className="text-violet-500" size={32} />
          <span className="font-bold text-sm">Download PDF</span>
        </button>
        <button onClick={() => downloadReport('image')} className="p-6 glass rounded-3xl flex flex-col items-center gap-3 hover:bg-white/10 transition-all border-2 border-transparent hover:border-pink-500/50">
          <ImageIcon className="text-pink-500" size={32} />
          <span className="font-bold text-sm">Save as Image</span>
        </button>
        <button onClick={() => downloadReport('csv')} className="p-6 glass rounded-3xl flex flex-col items-center gap-3 hover:bg-white/10 transition-all border-2 border-transparent hover:border-emerald-500/50">
          <TableIcon className="text-emerald-500" size={32} />
          <span className="font-bold text-sm">Export CSV</span>
        </button>
        <button className="p-6 glass rounded-3xl flex flex-col items-center gap-3 hover:bg-white/10 transition-all border-2 border-transparent hover:border-cyan-500/50">
          <Share2 className="text-cyan-500" size={32} />
          <span className="font-bold text-sm">Share Report</span>
        </button>
      </div>
    </div>
  );
};

export default Analytics;
