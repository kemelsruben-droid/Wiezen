import React from 'react';
import { Player } from '../types';
import { Trophy, RefreshCw, Crown, X } from 'lucide-react';

interface GameOverProps {
  players: Player[];
  onReset: () => void;
  onClose: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({ players, onReset, onClose }) => {
  if (!players || players.length === 0) return null;

  const sorted = [...players].sort((a, b) => b.score - a.score);
  const winner = sorted[0];

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-900 p-4`}>
       <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Simple CSS particles/confetti background effect */}
          <div className="absolute top-10 left-[20%] w-2 h-2 bg-yellow-400 rounded-full animate-bounce delay-75"></div>
          <div className="absolute top-20 right-[20%] w-3 h-3 bg-red-400 rounded-full animate-bounce"></div>
       </div>

       <div className="max-w-4xl w-full flex flex-col items-center relative z-10">
          <Crown className="w-20 h-20 text-yellow-400 mb-6 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)] animate-bounce" />
          <h1 className="text-5xl font-bold text-white mb-2 text-center">Spel Afgelopen!</h1>
          <p className="text-slate-400 mb-12 text-xl">De eindstand:</p>

          <div className="flex flex-col md:flex-row items-end justify-center gap-4 md:gap-8 mb-16 w-full">
             {/* 2nd Place */}
             {sorted[1] && (
                 <div className="flex flex-col items-center order-2 md:order-1">
                    <div className="mb-2 text-slate-300 font-bold text-xl">{sorted[1].name}</div>
                    <div className="w-24 md:w-32 h-32 md:h-40 bg-slate-400 rounded-t-lg flex items-center justify-center text-slate-800 font-bold text-2xl shadow-lg border-t-4 border-slate-300 relative">
                        <span className="opacity-50 text-4xl">2</span>
                        <div className="absolute bottom-4 text-sm font-mono bg-slate-800/20 px-2 py-1 rounded">{sorted[1].score} ptn</div>
                    </div>
                 </div>
             )}

             {/* 1st Place */}
             <div className="flex flex-col items-center order-1 md:order-2 z-10 transform scale-110">
                <Crown className="w-8 h-8 text-yellow-400 mb-2" />
                <div className="mb-2 text-yellow-400 font-bold text-2xl">{winner.name}</div>
                <div className="w-28 md:w-40 h-40 md:h-56 bg-yellow-400 rounded-t-lg flex items-center justify-center text-yellow-900 font-bold text-4xl shadow-xl shadow-yellow-400/20 border-t-4 border-yellow-200 relative">
                     <span className="opacity-50 text-6xl">1</span>
                     <div className="absolute bottom-6 text-lg font-mono bg-yellow-900/20 px-3 py-1 rounded">{winner.score} ptn</div>
                </div>
             </div>

             {/* 3rd Place */}
             {sorted[2] && (
                 <div className="flex flex-col items-center order-3">
                    <div className="mb-2 text-amber-700 font-bold text-xl">{sorted[2].name}</div>
                    <div className="w-24 md:w-32 h-24 md:h-32 bg-amber-600 rounded-t-lg flex items-center justify-center text-amber-900 font-bold text-2xl shadow-lg border-t-4 border-amber-500 relative">
                        <span className="opacity-50 text-4xl">3</span>
                        <div className="absolute bottom-4 text-sm font-mono bg-amber-900/20 px-2 py-1 rounded">{sorted[2].score} ptn</div>
                    </div>
                 </div>
             )}
          </div>

          {/* List for 4th player */}
          {sorted[3] && (
              <div className="w-full max-w-md bg-slate-800 rounded-lg p-4 flex justify-between items-center mb-8 border border-slate-700">
                  <span className="text-slate-400 font-mono">4.</span>
                  <span className="text-slate-200 font-bold">{sorted[3].name}</span>
                  <span className="text-red-400 font-mono">{sorted[3].score} ptn</span>
              </div>
          )}

          <div className="flex flex-col items-center space-y-4">
            <button 
                onClick={onReset}
                className="flex items-center px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-bold text-lg shadow-2xl transition-transform hover:scale-105"
            >
                <RefreshCw className="mr-2 w-6 h-6" />
                Nieuw Spel Starten
            </button>
            
            <button 
                onClick={onClose}
                className="text-slate-500 hover:text-white text-sm flex items-center transition-colors py-2"
            >
                <X className="w-4 h-4 mr-1" />
                Terug naar scorebord
            </button>
          </div>
       </div>
    </div>
  );
};