import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Gamepad2 } from 'lucide-react';

interface LoginScreenProps {
  key?: React.Key;
  onLogin: (username: string) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin(name.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center min-h-screen p-4"
    >
      <div className="bg-dark-surface p-8 rounded-2xl border border-neon-blue/20 glow-blue max-w-md w-full text-center">
        <motion.div
          animate={{ 
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="inline-block mb-6 text-neon-blue"
        >
          <Gamepad2 size={64} />
        </motion.div>
        
        <h1 className="text-4xl font-black mb-2 text-glow-blue text-neon-blue uppercase tracking-wider">
          Neon Tic Tac Toe
        </h1>
        <p className="text-gray-400 mb-8 text-sm">Enter the grid. Defeat the machine.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ENTER PLAYER NAME"
              className="w-full bg-black/50 border-2 border-neon-blue/50 rounded-xl px-4 py-3 text-center text-neon-blue placeholder-neon-blue/30 focus:outline-none focus:border-neon-blue focus:glow-blue transition-all uppercase tracking-widest"
              required
              maxLength={15}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-neon-blue text-black font-bold py-3 px-6 rounded-xl uppercase tracking-widest hover:glow-blue transition-all"
          >
            Initialize Game
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}
