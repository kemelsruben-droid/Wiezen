import React, { useState } from 'react';
import { Player } from '../types';
import { THEME } from '../constants';
import { Users, Play } from 'lucide-react';

interface GameSetupProps {
  onStartGame: (players: Player[]) => void;
}

export const GameSetup: React.FC<GameSetupProps> = ({ onStartGame }) => {
  const [names, setNames] = useState<string[]>(['Noord', 'Oost', 'Zuid', 'West']);

  const handleNameChange = (index: number, value: string) => {
    const newNames = [...names];
    newNames[index] = value;
    setNames(newNames);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const players: Player[] = names.map((name, i) => ({
      id: `p-${i}-${Date.now()}`,
      name: name.trim() || `Speler ${i + 1}`,
      score: 0
    }));
    onStartGame(players);
  };

  return (
    <div className={`max-w-md mx-auto mt-20 p-8 rounded-xl shadow-2xl ${THEME.card}`}>
      <div className="flex items-center justify-center mb-6">
        <Users className="w-12 h-12 text-emerald-500 mr-3" />
        <h1 className="text-3xl font-bold text-white">Nieuw Spel</h1>
      </div>
      <p className="text-slate-400 text-center mb-8">
        Voer de namen van de 4 spelers in om te beginnen met Wiezen.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {names.map((name, index) => (
          <div key={index} className="relative">
            <span className="absolute left-3 top-3 text-slate-500 font-mono text-sm">
              {['N', 'O', 'Z', 'W'][index]}
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(index, e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder={`Naam speler ${index + 1}`}
            />
          </div>
        ))}
        
        <button
          type="submit"
          className={`w-full flex items-center justify-center py-4 rounded-lg font-bold text-lg mt-6 transition-all transform hover:scale-[1.02] ${THEME.primary}`}
        >
          <Play className="w-5 h-5 mr-2" />
          Start Spel
        </button>
      </form>
    </div>
  );
};