import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Frown, Minus, RotateCcw, BarChart3, LogOut } from 'lucide-react';
import { Player, GameStats } from '../types';
import { cn } from '../lib/utils';

interface GameScreenProps {
  key?: React.Key;
  username: string;
  onUpdateStats: (result: 'win' | 'loss' | 'draw') => void;
  onNavigateStats: () => void;
  onLogout: () => void;
}

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

export function GameScreen({ username, onUpdateStats, onNavigateStats, onLogout }: GameScreenProps) {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState<boolean>(true);
  const [winner, setWinner] = useState<Player | 'Draw'>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);

  const checkWinner = (squares: Player[]): { winner: Player | 'Draw', line: number[] | null } => {
    for (let i = 0; i < WINNING_COMBINATIONS.length; i++) {
      const [a, b, c] = WINNING_COMBINATIONS[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: [a, b, c] };
      }
    }
    if (!squares.includes(null)) {
      return { winner: 'Draw', line: null };
    }
    return { winner: null, line: null };
  };

  const handleMove = useCallback((index: number) => {
    if (board[index] || winner || !isXNext) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    setIsXNext(false);

    const result = checkWinner(newBoard);
    if (result.winner) {
      setWinner(result.winner);
      setWinningLine(result.line);
      onUpdateStats(result.winner === 'X' ? 'win' : result.winner === 'O' ? 'loss' : 'draw');
    }
  }, [board, winner, isXNext, onUpdateStats]);

  // AI Move Logic
  useEffect(() => {
    if (!isXNext && !winner) {
      const timer = setTimeout(() => {
        const availableSpots = board.map((val, idx) => val === null ? idx : null).filter(val => val !== null) as number[];
        if (availableSpots.length === 0) return;

        let moveIndex = -1;

        // 1. Try to win
        for (const spot of availableSpots) {
          const testBoard = [...board];
          testBoard[spot] = 'O';
          if (checkWinner(testBoard).winner === 'O') {
            moveIndex = spot;
            break;
          }
        }

        // 2. Try to block
        if (moveIndex === -1) {
          for (const spot of availableSpots) {
            const testBoard = [...board];
            testBoard[spot] = 'X';
            if (checkWinner(testBoard).winner === 'X') {
              moveIndex = spot;
              break;
            }
          }
        }

        // 3. Take center if available
        if (moveIndex === -1 && availableSpots.includes(4)) {
          moveIndex = 4;
        }

        // 4. Random move
        if (moveIndex === -1) {
          const randomIndex = Math.floor(Math.random() * availableSpots.length);
          moveIndex = availableSpots[randomIndex];
        }

        const newBoard = [...board];
        newBoard[moveIndex] = 'O';
        setBoard(newBoard);
        setIsXNext(true);

        const result = checkWinner(newBoard);
        if (result.winner) {
          setWinner(result.winner);
          setWinningLine(result.line);
          onUpdateStats(result.winner === 'X' ? 'win' : result.winner === 'O' ? 'loss' : 'draw');
        }
      }, 600); // Small delay for realism
      return () => clearTimeout(timer);
    }
  }, [isXNext, winner, board, onUpdateStats]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setWinningLine(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="flex flex-col items-center justify-center min-h-screen p-4"
    >
      <div className="w-full max-w-md bg-dark-surface p-6 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-neon-blue/20 flex items-center justify-center border border-neon-blue/50 glow-blue">
              <span className="text-neon-blue font-bold text-xl uppercase">{username[0]}</span>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest">Player 1</p>
              <p className="font-bold text-neon-blue text-glow-blue uppercase">{username}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={onNavigateStats} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-gray-300 hover:text-white" title="Statistics">
              <BarChart3 size={20} />
            </button>
            <button onClick={onLogout} className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 transition-colors text-gray-300 hover:text-red-400" title="Logout">
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="text-center mb-8 h-8 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {!winner ? (
              <motion.p
                key={isXNext ? 'player' : 'ai'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={cn(
                  "text-lg font-bold uppercase tracking-widest",
                  isXNext ? "text-neon-blue text-glow-blue" : "text-neon-pink text-glow-pink"
                )}
              >
                {isXNext ? "Your Turn" : "System Processing..."}
              </motion.p>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2"
              >
                {winner === 'X' && <><Trophy className="text-neon-green" /><span className="text-neon-green text-glow-green font-bold text-xl uppercase tracking-widest">Victory</span></>}
                {winner === 'O' && <><Frown className="text-neon-pink" /><span className="text-neon-pink text-glow-pink font-bold text-xl uppercase tracking-widest">Defeat</span></>}
                {winner === 'Draw' && <><Minus className="text-gray-400" /><span className="text-gray-400 font-bold text-xl uppercase tracking-widest">Draw</span></>}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {board.map((cell, index) => {
            const isWinningCell = winningLine?.includes(index);
            return (
              <motion.button
                key={index}
                whileHover={!cell && !winner && isXNext ? { scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' } : {}}
                whileTap={!cell && !winner && isXNext ? { scale: 0.95 } : {}}
                onClick={() => handleMove(index)}
                disabled={!!cell || !!winner || !isXNext}
                className={cn(
                  "h-24 sm:h-28 rounded-2xl flex items-center justify-center text-5xl font-black transition-all duration-300",
                  "bg-black/40 border border-white/5",
                  !cell && !winner && isXNext && "cursor-pointer hover:border-neon-blue/50",
                  (cell || winner || !isXNext) && "cursor-default",
                  isWinningCell && cell === 'X' && "bg-neon-green/20 border-neon-green glow-green",
                  isWinningCell && cell === 'O' && "bg-neon-pink/20 border-neon-pink glow-pink"
                )}
              >
                <AnimatePresence>
                  {cell && (
                    <motion.span
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className={cn(
                        cell === 'X' ? "text-neon-blue text-glow-blue" : "text-neon-pink text-glow-pink"
                      )}
                    >
                      {cell}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>

        {/* Controls */}
        <AnimatePresence>
          {winner && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center"
            >
              <button
                onClick={resetGame}
                className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors"
              >
                <RotateCcw size={20} />
                Play Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
}
