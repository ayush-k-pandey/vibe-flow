
import React from 'react';
import { User, Team } from '../types';
import { Users, Shield, Trophy, Target, Zap, TrendingUp } from 'lucide-react';

interface TeamsProps {
  user: User;
}

const Teams: React.FC<TeamsProps> = ({ user }) => {
  const mockLeaderboard = [
    { id: '1', name: 'Alex Grinds', points: 3450, avatar: 'https://picsum.photos/seed/alex/100' },
    { id: '2', name: 'Sarah Flow', points: 2900, avatar: 'https://picsum.photos/seed/sarah/100' },
    { id: '3', name: user.name, points: user.totalPoints, avatar: user.avatar, isCurrent: true },
    { id: '4', name: 'Dev Dino', points: 1800, avatar: 'https://picsum.photos/seed/dino/100' },
    { id: '5', name: 'Mindset May', points: 1550, avatar: 'https://picsum.photos/seed/may/100' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black font-heading">Squad Central</h2>
          <p className="text-slate-500">Grind together, level up faster.</p>
        </div>
        <button className="px-6 py-3 bg-violet-600 rounded-2xl flex items-center gap-2 font-bold hover:bg-violet-700 transition-all text-white neon-glow">
          <Users size={20} /> Create Squad
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Squads */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass p-8 rounded-[40px] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
              <Shield size={120} className="text-cyan-500" />
            </div>
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 rounded-3xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center border border-cyan-500/20">
                <Users size={40} />
              </div>
              <div>
                <h3 className="text-2xl font-black font-heading">Alpha Code Squad</h3>
                <p className="text-slate-500">8 Members <span className="mx-2">|</span> 12.5k Total Points</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-bold">Weekly Goal: 15,000 XP</span>
                <span className="text-cyan-500 font-black">84%</span>
              </div>
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 w-[84%]" />
              </div>
            </div>

            <div className="flex -space-x-3 mt-8">
              {[1, 2, 3, 4, 5].map(i => (
                <img key={i} src={`https://picsum.photos/seed/u${i}/64`} className="w-12 h-12 rounded-2xl border-4 border-slate-900" alt="member" />
              ))}
              <div className="w-12 h-12 rounded-2xl bg-slate-800 border-4 border-slate-900 flex items-center justify-center text-xs font-bold text-slate-400">
                +3
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass p-8 rounded-[40px] border-t-4 border-t-violet-500">
              <Zap className="text-violet-500 mb-4" size={32} />
              <h4 className="text-lg font-bold mb-2">Synergy Boost</h4>
              <p className="text-sm text-slate-500 leading-relaxed">Completing tasks within 1 hour of your squad mates grants a 1.2x multiplier.</p>
            </div>
            <div className="glass p-8 rounded-[40px] border-t-4 border-t-emerald-500">
              <TrendingUp className="text-emerald-500 mb-4" size={32} />
              <h4 className="text-lg font-bold mb-2">Team Growth</h4>
              <p className="text-sm text-slate-500 leading-relaxed">Your squad has improved productivity by 22% since last month. Keep pushing!</p>
            </div>
          </div>
        </div>

        {/* Global Leaderboard */}
        <div className="glass rounded-[40px] p-8 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-8">
            <Trophy className="text-yellow-500" size={24} />
            <h3 className="text-xl font-bold font-heading">Leaderboard</h3>
          </div>
          <div className="space-y-6 flex-1">
            {mockLeaderboard.map((entry, i) => (
              <div key={entry.id} className={`flex items-center gap-4 p-4 rounded-3xl transition-all ${entry.isCurrent ? 'bg-violet-600/10 ring-1 ring-violet-500/30 shadow-lg shadow-violet-500/5' : 'hover:bg-white/5'}`}>
                <span className={`text-lg font-black w-6 ${i === 0 ? 'text-yellow-500' : i === 1 ? 'text-slate-300' : i === 2 ? 'text-orange-500' : 'text-slate-500'}`}>
                  #{i + 1}
                </span>
                <img src={entry.avatar || `https://picsum.photos/seed/${entry.id}/64`} className="w-12 h-12 rounded-2xl object-cover" alt={entry.name} />
                <div className="flex-1 min-w-0">
                  <p className={`font-bold truncate ${entry.isCurrent ? 'text-violet-400' : ''}`}>{entry.name}</p>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{entry.points} XP</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-4 text-center text-sm font-bold text-slate-400 hover:text-white transition-colors border-t border-white/5 pt-8">
            View Global Rankings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Teams;
