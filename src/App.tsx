/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { LoginScreen } from './components/LoginScreen';
import { GameScreen } from './components/GameScreen';
import { StatsScreen } from './components/StatsScreen';
import { ScreenState, GameStats } from './types';

export default function App() {
  const [screen, setScreen] = useState<ScreenState>('login');
  const [username, setUsername] = useState<string | null>(null);
  const [stats, setStats] = useState<GameStats>({ wins: 0, losses: 0, draws: 0 });

  // Load data from local storage on mount
  useEffect(() => {
    const storedUsername = localStorage.getItem('ticTacToeUsername');
    if (storedUsername) {
      setUsername(storedUsername);
      setScreen('game');
    }

    const storedStats = localStorage.getItem('ticTacToeStats');
    if (storedStats) {
      try {
        setStats(JSON.parse(storedStats));
      } catch (e) {
        console.error('Failed to parse stats', e);
      }
    }
  }, []);

  const handleLogin = (name: string) => {
    setUsername(name);
    localStorage.setItem('ticTacToeUsername', name);
    setScreen('game');
  };

  const handleLogout = () => {
    setUsername(null);
    localStorage.removeItem('ticTacToeUsername');
    setScreen('login');
  };

  const handleUpdateStats = (result: 'win' | 'loss' | 'draw') => {
    setStats(prev => {
      const newStats = {
        ...prev,
        wins: result === 'win' ? prev.wins + 1 : prev.wins,
        losses: result === 'loss' ? prev.losses + 1 : prev.losses,
        draws: result === 'draw' ? prev.draws + 1 : prev.draws,
      };
      localStorage.setItem('ticTacToeStats', JSON.stringify(newStats));
      return newStats;
    });
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white overflow-hidden relative selection:bg-neon-blue/30">
      {/* Background Grid Effect */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
           style={{
             backgroundImage: 'linear-gradient(rgba(0, 243, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 243, 255, 0.1) 1px, transparent 1px)',
             backgroundSize: '40px 40px'
           }}
      />
      
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {screen === 'login' && (
            <LoginScreen key="login" onLogin={handleLogin} />
          )}
          {screen === 'game' && username && (
            <GameScreen 
              key="game" 
              username={username} 
              onUpdateStats={handleUpdateStats}
              onNavigateStats={() => setScreen('stats')}
              onLogout={handleLogout}
            />
          )}
          {screen === 'stats' && (
            <StatsScreen 
              key="stats" 
              stats={stats} 
              onBack={() => setScreen('game')} 
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

