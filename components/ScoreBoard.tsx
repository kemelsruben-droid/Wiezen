import React, { useRef, useEffect } from 'react';
import { GameState } from '../types';
import { THEME } from '../constants';
import { Trophy, ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';

interface ScoreBoardProps {
  gameState: GameState;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ gameState }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new round added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [gameState.rounds]);

  // Determine leaders
  const sortedPlayers = [...gameState.players].sort((a, b) => b.score - a.score);
  const leaderId = sortedPlayers[0]?.id;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header Cards */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {gameState.players.map((player) => (
          <div 
            key={player.id} 
            className={`p-4 rounded-xl flex flex-col items-center justify-center relative overflow-hidden transition-all duration-500 ${
                player.id === leaderId ? 'bg-gradient-to-br from-emerald-800 to-emerald-900 border-emerald-500 ring-1 ring-emerald-500/50' : 'bg-slate-800 border-slate-700'
            } border shadow-lg`}
          >
             {player.id === leaderId && (
                 <Trophy className="absolute top-2 right-2 w-4 h-4 text-yellow-400 animate-pulse" />
             )}
             <span className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1 truncate w-full text-center">
                {player.name}
             </span>
             <span className={`text-2xl lg:text-3xl font-bold ${player.score >= 0 ? 'text-white' : 'text-red-400'}`}>
                {player.score}
             </span>
          </div>
        ))}
      </div>

      {/* Scrollable Table Area */}
      <div className="flex-1 overflow-hidden rounded-xl border border-slate-700 bg-slate-900/50 shadow-inner flex flex-col">
          {/* Table Header */}
          <div className="grid grid-cols-[3rem_1fr_repeat(4,minmax(3rem,1fr))] bg-slate-800 p-3 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700">
             <div className="text-center">#</div>
             <div>Contract</div>
             {gameState.players.map(p => (
                 <div key={p.id} className="text-center truncate px-1">{p.name}</div>
             ))}
          </div>

          {/* Table Body */}
          <div ref={scrollRef} className="overflow-y-auto flex-1 p-0 scroll-smooth">
             {gameState.rounds.length === 0 && (
                 <div className="flex flex-col items-center justify-center h-full text-slate-500">
                     <p>Nog geen rondes gespeeld.</p>
                 </div>
             )}
             {gameState.rounds.map((round) => (
                 <div key={round.id} className="grid grid-cols-[3rem_1fr_repeat(4,minmax(3rem,1fr))] p-3 border-b border-slate-800 hover:bg-slate-800/50 transition-colors text-sm">
                     <div className="text-center text-slate-500 font-mono">{round.roundNumber}</div>
                     <div className="flex flex-col">
                        <span className="text-slate-200 font-medium">{round.contract}</span>
                        <span className="text-xs text-slate-500">
                            {round.tricksWon} slagen • {round.points} ptn
                        </span>
                     </div>
                     {gameState.players.map(p => {
                         const diff = round.result[p.id];
                         if (diff === undefined) return <div key={p.id}></div>;
                         return (
                             <div key={p.id} className={`flex items-center justify-center font-mono font-medium ${
                                 diff > 0 ? 'text-emerald-400' : diff < 0 ? 'text-red-400' : 'text-slate-600'
                             }`}>
                                {diff > 0 ? '+' : ''}{diff}
                             </div>
                         );
                     })}
                 </div>
             ))}
          </div>
      </div>
    </div>
  );
};