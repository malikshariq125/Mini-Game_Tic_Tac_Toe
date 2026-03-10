import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Trophy, Frown, Minus } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { GameStats } from '../types';

interface StatsScreenProps {
  key?: React.Key;
  stats: GameStats;
  onBack: () => void;
}

export function StatsScreen({ stats, onBack }: StatsScreenProps) {
  const totalGames = stats.wins + stats.losses + stats.draws;

  const pieData = [
    { name: 'Wins', value: stats.wins, color: '#00ff00' },
    { name: 'Losses', value: stats.losses, color: '#ff00ff' },
    { name: 'Draws', value: stats.draws, color: '#9ca3af' },
  ].filter(d => d.value > 0);

  const barData = [
    { name: 'Wins', value: stats.wins, fill: '#00ff00' },
    { name: 'Losses', value: stats.losses, fill: '#ff00ff' },
    { name: 'Draws', value: stats.draws, fill: '#9ca3af' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex flex-col items-center justify-center min-h-screen p-4"
    >
      <div className="w-full max-w-2xl bg-dark-surface p-6 sm:p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center mb-8 border-b border-white/10 pb-4">
          <button 
            onClick={onBack}
            className="p-2 mr-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-2xl font-bold text-neon-blue text-glow-blue uppercase tracking-widest">
            Battle Statistics
          </h2>
        </div>

        {totalGames === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-xl uppercase tracking-widest">No battles fought yet.</p>
            <p className="text-sm mt-2">Return to the grid and play a game.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-black/40 p-4 rounded-2xl border border-neon-green/20 flex flex-col items-center justify-center">
                <Trophy className="text-neon-green mb-2" size={24} />
                <span className="text-3xl font-black text-neon-green text-glow-green">{stats.wins}</span>
                <span className="text-xs text-gray-400 uppercase tracking-widest mt-1">Wins</span>
              </div>
              <div className="bg-black/40 p-4 rounded-2xl border border-neon-pink/20 flex flex-col items-center justify-center">
                <Frown className="text-neon-pink mb-2" size={24} />
                <span className="text-3xl font-black text-neon-pink text-glow-pink">{stats.losses}</span>
                <span className="text-xs text-gray-400 uppercase tracking-widest mt-1">Losses</span>
              </div>
              <div className="bg-black/40 p-4 rounded-2xl border border-gray-500/20 flex flex-col items-center justify-center">
                <Minus className="text-gray-400 mb-2" size={24} />
                <span className="text-3xl font-black text-gray-300">{stats.draws}</span>
                <span className="text-xs text-gray-400 uppercase tracking-widest mt-1">Draws</span>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Pie Chart */}
              <div className="bg-black/40 p-4 rounded-2xl border border-white/5 h-64 flex flex-col">
                <h3 className="text-sm text-gray-400 uppercase tracking-widest mb-2 text-center">Win Rate Distribution</h3>
                <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#12121a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                        itemStyle={{ color: '#fff' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bar Chart */}
              <div className="bg-black/40 p-4 rounded-2xl border border-white/5 h-64 flex flex-col">
                <h3 className="text-sm text-gray-400 uppercase tracking-widest mb-2 text-center">Match Outcomes</h3>
                <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                      <Tooltip 
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        contentStyle={{ backgroundColor: '#12121a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {barData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
