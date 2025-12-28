import React, { useState, useEffect } from 'react';
import { GameState, Player, Round, ContractType } from './types';
import { GameSetup } from './components/GameSetup';
import { ScoreBoard } from './components/ScoreBoard';
import { RoundInput } from './components/RoundInput';
import { AIAssistant } from './components/AIAssistant';
import { GameRules } from './components/GameRules';
import { GameOver } from './components/GameOver';
import { THEME } from './constants';
import { PlusCircle, RefreshCw, BarChart2, BookOpen, Flag, AlertCircle, X } from 'lucide-react';
import { LineChart, Line, XAxis as ReXAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

function App() {
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    rounds: [],
    dealerIndex: 0,
    gameStarted: false,
    gameFinished: false,
    nextRoundDoubled: false
  });

  const [showInput, setShowInput] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showRules, setShowRules] = useState(false);

  // Load from local storage on mount (optional persistence)
  useEffect(() => {
    const saved = localStorage.getItem('wiezen_gamestate');
    if (saved) {
      try {
        setGameState(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load saved game", e);
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('wiezen_gamestate', JSON.stringify(gameState));
  }, [gameState]);

  const handleStartGame = (players: Player[]) => {
    setGameState({
      players,
      rounds: [],
      dealerIndex: 0,
      gameStarted: true,
      gameFinished: false,
      nextRoundDoubled: false
    });
  };

  const handleRoundComplete = (round: Round) => {
    // Determine round number
    round.roundNumber = gameState.rounds.length + 1;

    // Check if this was a Pass Round
    const isPass = round.contract === ContractType.PASS;

    // Update player scores (only if not a pass round, though result is 0 anyway)
    const updatedPlayers = gameState.players.map(p => ({
      ...p,
      score: p.score + (round.result[p.id] || 0)
    }));

    setGameState(prev => ({
      ...prev,
      players: updatedPlayers,
      rounds: [...prev.rounds, round],
      dealerIndex: (prev.dealerIndex + 1) % 4,
      // If it's a pass round, next one is doubled. 
      // If it was a normal played round, reset double status.
      nextRoundDoubled: isPass ? true : false
    }));
    setShowInput(false);
  };

  const handleReset = () => {
    if (confirm("Ben je zeker dat je het spel wilt stoppen en opnieuw wilt beginnen?")) {
      setGameState({
        players: [],
        rounds: [],
        dealerIndex: 0,
        gameStarted: false,
        gameFinished: false,
        nextRoundDoubled: false
      });
      localStorage.removeItem('wiezen_gamestate');
    }
  };

  const handleFinishGame = () => {
    // Direct finish without confirm for smoother UX, user can go back from GameOver screen if needed
    setGameState(prev => ({ ...prev, gameFinished: true }));
  }

  if (gameState.gameFinished) {
      return (
          <GameOver 
            players={gameState.players} 
            onClose={() => setGameState(prev => ({ ...prev, gameFinished: false }))}
            onReset={() => {
                const newState = {
                    players: [],
                    rounds: [],
                    dealerIndex: 0,
                    gameStarted: false,
                    gameFinished: false,
                    nextRoundDoubled: false
                };
                setGameState(newState);
                // Ensure local storage is cleared for the next load
                localStorage.removeItem('wiezen_gamestate');
            }} 
          />
      )
  }

  if (!gameState.gameStarted) {
    return (
      <div className={`min-h-screen ${THEME.background} p-4`}>
        <GameSetup onStartGame={handleStartGame} />
      </div>
    );
  }

  // Prepare chart data
  const chartData = gameState.rounds.map((r, i) => {
     const point: any = { name: i + 1 };
     gameState.players.forEach(p => {
         let score = 0;
         for (let j = 0; j <= i; j++) {
             score += gameState.rounds[j].result[p.id] || 0;
         }
         point[p.name] = score;
     });
     return point;
  });
  const initialPoint: any = { name: 0 };
  gameState.players.forEach(p => initialPoint[p.name] = 0);
  const finalChartData = [initialPoint, ...chartData];

  const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444']; // Emerald, Blue, Amber, Red

  return (
    <div className={`min-h-screen ${THEME.background} text-slate-200 flex flex-col md:flex-row overflow-hidden`}>
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen max-h-screen p-4 md:p-6 overflow-hidden relative">
        
        {/* Top Bar */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 space-y-3 md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Wiezen Scorekeeper</h1>
            <div className="flex items-center space-x-3 mt-1">
                <p className="text-xs text-slate-500 font-mono">
                Dealer: <span className="text-emerald-400 font-bold">{gameState.players[gameState.dealerIndex].name}</span>
                </p>
                {gameState.nextRoundDoubled && (
                    <div className="flex items-center bg-yellow-900/40 text-yellow-400 px-2 py-0.5 rounded text-xs font-bold border border-yellow-700/50 animate-pulse">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Volgende x2
                    </div>
                )}
            </div>
          </div>
          <div className="flex space-x-2">
             <button 
                onClick={() => setShowRules(true)} 
                className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-emerald-400 transition-colors"
                title="Speluitleg"
             >
                <BookOpen className="w-5 h-5" />
             </button>
             <button 
                onClick={() => setShowStats(!showStats)} 
                className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 text-slate-400 transition-colors"
                title="Statistieken"
             >
                <BarChart2 className="w-5 h-5" />
             </button>
             <button 
                onClick={handleFinishGame} 
                className="px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-500 text-white font-bold transition-colors flex items-center shadow-lg hover:shadow-indigo-900/50 transform hover:scale-105"
             >
                <Flag className="w-4 h-4 mr-2" />
                Finish
             </button>
             <button 
                onClick={handleReset} 
                className="p-2 bg-slate-800 rounded-lg hover:bg-red-900/30 text-slate-400 hover:text-red-400 transition-colors"
                title="Reset Spel"
             >
                <RefreshCw className="w-5 h-5" />
             </button>
          </div>
        </div>

        {/* Dynamic Content: Stats or Scoreboard */}
        {showStats ? (
           <div className="flex-1 bg-slate-800/50 rounded-2xl border border-slate-700 p-4 relative">
              <button onClick={() => setShowStats(false)} className="absolute top-4 right-4 z-10 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
              <h2 className="text-lg font-bold text-white mb-4">Score Verloop</h2>
              <div className="w-full h-[80%]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={finalChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <ReXAxis dataKey="name" stroke="#64748b" />
                        <YAxis stroke="#64748b" />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }} 
                            itemStyle={{ color: '#fff' }}
                        />
                        {gameState.players.map((p, i) => (
                            <Line 
                                key={p.id} 
                                type="monotone" 
                                dataKey={p.name} 
                                stroke={colors[i % colors.length]} 
                                strokeWidth={3}
                                dot={{r: 4}}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
              </div>
           </div>
        ) : (
            <div className="flex-1 overflow-hidden relative">
                <ScoreBoard gameState={gameState} />
            </div>
        )}

        {/* Floating Action Button for New Round */}
        <div className="mt-4 flex justify-center md:justify-end">
            <button
                onClick={() => setShowInput(true)}
                className={`group flex items-center justify-center rounded-full px-8 py-4 shadow-xl shadow-emerald-900/50 transition-all transform hover:scale-105 active:scale-95 ${
                    gameState.nextRoundDoubled 
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white animate-pulse ring-2 ring-yellow-300' 
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
            >
                <PlusCircle className="w-6 h-6 mr-2 group-hover:rotate-90 transition-transform" />
                <span className="font-bold text-lg">
                    {gameState.nextRoundDoubled ? 'Nieuwe Ronde (x2)' : 'Nieuwe Ronde'}
                </span>
            </button>
        </div>
      </main>

      {/* Modals & Overlays */}
      {showInput && (
        <RoundInput 
            players={gameState.players} 
            dealerIndex={gameState.dealerIndex}
            isDoubled={gameState.nextRoundDoubled}
            onRoundComplete={handleRoundComplete}
            onCancel={() => setShowInput(false)}
        />
      )}

      {showRules && <GameRules onClose={() => setShowRules(false)} />}

      {/* AI Assistant */}
      <AIAssistant />
    </div>
  );
}

export default App;