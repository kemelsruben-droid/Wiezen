import React, { useState, useEffect } from 'react';
import { Player, ContractType, Round } from '../types';
import { CONTRACT_OPTIONS, THEME } from '../constants';
import { Check, X, Ban, AlertCircle } from 'lucide-react';

interface RoundInputProps {
  players: Player[];
  dealerIndex: number;
  isDoubled: boolean; // Prop to indicate if this round counts double
  onRoundComplete: (round: Round) => void;
  onCancel: () => void;
}

export const RoundInput: React.FC<RoundInputProps> = ({ players, dealerIndex, isDoubled, onRoundComplete, onCancel }) => {
  const [selectedContract, setSelectedContract] = useState<ContractType>(ContractType.NORMAL);
  const [activePlayerIds, setActivePlayerIds] = useState<string[]>([]);
  const [tricksWon, setTricksWon] = useState<number>(8);
  const [isPassRound, setIsPassRound] = useState(false); // State for "Everyone Passed"

  // Set default targets when contract changes
  useEffect(() => {
    if (isPassRound) return;
    const contractDef = CONTRACT_OPTIONS.find(c => c.type === selectedContract);
    if (contractDef) {
      setTricksWon(contractDef.target);
      setActivePlayerIds([]);
    }
  }, [selectedContract, isPassRound]);

  const togglePlayer = (id: string) => {
    if (isPassRound) return;
    const contractDef = CONTRACT_OPTIONS.find(c => c.type === selectedContract);
    const isTeamGame = contractDef?.category === 'team';

    if (activePlayerIds.includes(id)) {
      setActivePlayerIds(activePlayerIds.filter(p => p !== id));
    } else {
      if (isTeamGame) {
        if (activePlayerIds.length < 2) setActivePlayerIds([...activePlayerIds, id]);
      } else {
        if (activePlayerIds.length < 1) setActivePlayerIds([...activePlayerIds, id]);
        else setActivePlayerIds([id]);
      }
    }
  };

  const calculateScores = () => {
    // Special Case: Pass
    if (isPassRound) {
        return { basePoints: 0, result: {}, defendingPlayerIds: [] };
    }

    const contractDef = CONTRACT_OPTIONS.find(c => c.type === selectedContract);
    if (!contractDef) return null;

    let basePoints = 0;
    const isWin = tricksWon >= contractDef.target;
    
    // Standard Calculation
    switch (selectedContract) {
        case ContractType.ALONE:
            if (isWin) basePoints = 2 + (tricksWon - 5);
            else basePoints = -(2 + (5 - tricksWon));
            break;
        case ContractType.NORMAL:
            const normalDiff = Math.abs(tricksWon - 8);
            let normalVal = 2 + normalDiff;
            if (tricksWon === 13) normalVal *= 2;
            basePoints = isWin ? normalVal : -normalVal;
            break;
        case ContractType.TROEL:
            if (tricksWon === 13) basePoints = 20;
            else if (isWin) basePoints = 4 + ((tricksWon - 8) * 2);
            else basePoints = -(4 + ((8 - tricksWon) * 2));
            break;
        case ContractType.ABONDANCE:
            const abondanceTable: {[key:number]: number} = { 9: 4, 10: 7, 11: 8, 12: 9 };
            if (isWin) basePoints = abondanceTable[tricksWon] || 9; 
            else basePoints = -4; 
            break;
        case ContractType.MISERIE:
            basePoints = (tricksWon === 0) ? 7 : -7;
            break;
        case ContractType.MISERIE_TABLE:
            basePoints = (tricksWon === 0) ? 14 : -14;
            break;
        case ContractType.PICCOLO:
             basePoints = (tricksWon === 1) ? 5 : -5;
             break;
        case ContractType.SOLO:
            basePoints = (tricksWon === 13) ? 25 : -25;
            break;
        case ContractType.SOLO_SLIM:
            basePoints = (tricksWon === 13) ? 30 : -30;
            break;
    }

    // APPLY DOUBLING LOGIC
    if (isDoubled) {
        basePoints *= 2;
    }

    const result: Record<string, number> = {};
    const defendingPlayerIds = players.filter(p => !activePlayerIds.includes(p.id)).map(p => p.id);
    
    // Validation
    if (activePlayerIds.length === 0) return null;
    if (contractDef.category === 'team' && activePlayerIds.length !== 2) return null;
    if (contractDef.category === 'solo' && activePlayerIds.length !== 1) return null;

    if (activePlayerIds.length === 1) {
        const activeId = activePlayerIds[0];
        result[activeId] = basePoints * 3;
        defendingPlayerIds.forEach(id => { result[id] = -basePoints; });
    } else {
        activePlayerIds.forEach(id => result[id] = basePoints);
        defendingPlayerIds.forEach(id => result[id] = -basePoints);
    }
    
    return { basePoints, result, defendingPlayerIds };
  };

  const handleSubmit = () => {
    const calc = calculateScores();
    if (!calc) return;

    const round: Round = {
      id: `r-${Date.now()}`,
      roundNumber: 0, 
      contract: isPassRound ? ContractType.PASS : selectedContract,
      players: players.map(p => p.id),
      activePlayerIds: isPassRound ? [] : activePlayerIds,
      defendingPlayerIds: calc.defendingPlayerIds,
      tricksWon: isPassRound ? 0 : tricksWon,
      points: Math.abs(calc.basePoints),
      result: calc.result,
      timestamp: Date.now(),
      isDoubled: isDoubled && !isPassRound // Store fact that points were doubled
    };
    onRoundComplete(round);
  };

  const currentContractDef = CONTRACT_OPTIONS.find(c => c.type === selectedContract);
  const isTeam = currentContractDef?.category === 'team';
  const isValid = isPassRound ? true : (isTeam ? activePlayerIds.length === 2 : activePlayerIds.length === 1);

  const renderContractButton = (opt: typeof CONTRACT_OPTIONS[0]) => (
    <button
      key={opt.type}
      onClick={() => { setSelectedContract(opt.type); setIsPassRound(false); }}
      className={`p-3 rounded-lg text-xs md:text-sm font-semibold transition-all flex flex-col items-center justify-center text-center h-20 border-2 ${
        !isPassRound && selectedContract === opt.type 
          ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg scale-105' 
          : 'bg-slate-700 border-transparent text-slate-300 hover:bg-slate-600 hover:border-slate-500'
      }`}
    >
      <span>{opt.label}</span>
      <span className="text-[10px] mt-1 opacity-60 font-mono">Target: {opt.target === 0 ? '0' : opt.target + '+'}</span>
    </button>
  );

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 md:p-4`}>
      <div className={`w-full max-w-3xl ${THEME.card} rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]`}>
        
        {/* Header */}
        <div className="p-5 bg-slate-900 border-b border-slate-700 flex justify-between items-center shrink-0">
          <h2 className="text-xl md:text-2xl font-bold text-white flex items-center">
             <span className="mr-3 bg-emerald-600 text-xs px-2 py-1 rounded uppercase tracking-wider">Ronde</span>
             Resultaat Invoeren
          </h2>
          {isDoubled && (
              <div className="flex items-center bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full border border-yellow-500/50 animate-pulse">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  <span className="font-bold text-sm">Dubbele Punten!</span>
              </div>
          )}
          <button onClick={onCancel} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"><X /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          
          {/* Contract Selection */}
          <section>
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs uppercase tracking-wider text-emerald-400 font-bold flex items-center">
                    1. Kies Speltype
                </h3>
            </div>
            
            <div className="space-y-3">
                {/* Special Pass Button */}
                <button 
                    onClick={() => setIsPassRound(!isPassRound)}
                    className={`w-full p-3 rounded-xl border-2 font-bold text-sm uppercase tracking-wide transition-all flex items-center justify-center ${
                        isPassRound 
                        ? 'bg-red-600 border-red-400 text-white shadow-lg'
                        : 'bg-slate-800 border-slate-600 text-slate-400 hover:bg-slate-700 hover:border-slate-500'
                    }`}
                >
                    <Ban className="w-4 h-4 mr-2" />
                    Iedereen Past (Volgende ronde x2)
                </button>

                {/* Contracts Grid (Disabled if Pass is selected) */}
                <div className={`transition-opacity duration-300 space-y-3 ${isPassRound ? 'opacity-30 pointer-events-none grayscale' : 'opacity-100'}`}>
                    <div className="relative">
                        <span className="absolute -top-2.5 left-2 bg-slate-800 px-2 text-[10px] text-slate-500 font-bold uppercase">2 vs 2</span>
                        <div className="grid grid-cols-2 gap-2 border border-slate-700 rounded-xl p-3 pt-4">
                            {CONTRACT_OPTIONS.filter(c => c.category === 'team').map(renderContractButton)}
                        </div>
                    </div>

                    <div className="relative">
                        <span className="absolute -top-2.5 left-2 bg-slate-800 px-2 text-[10px] text-slate-500 font-bold uppercase">1 vs 3</span>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 border border-slate-700 rounded-xl p-3 pt-4">
                            {CONTRACT_OPTIONS.filter(c => c.category === 'solo').map(renderContractButton)}
                        </div>
                    </div>
                </div>
            </div>
          </section>

          {!isPassRound && (
              <div className="grid md:grid-cols-2 gap-6 animate-in fade-in duration-500">
                {/* Player Selection */}
                <section>
                    <h3 className="text-xs uppercase tracking-wider text-emerald-400 font-bold mb-3">
                    2. Wie Speelt? {isTeam ? '(Kies 2)' : '(Kies 1)'}
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                    {players.map((p, idx) => {
                        const isActive = activePlayerIds.includes(p.id);
                        return (
                        <button
                            key={p.id}
                            onClick={() => togglePlayer(p.id)}
                            className={`flex items-center p-3 rounded-xl border transition-all ${
                                isActive 
                                ? 'border-emerald-500 bg-emerald-900/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                                : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                            }`}
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 font-bold text-sm ${
                                isActive ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-400'
                            }`}>
                                {p.name.charAt(0)}
                            </div>
                            <span className={`text-sm font-medium ${isActive ? 'text-white' : 'text-slate-400'}`}>{p.name}</span>
                        </button>
                        );
                    })}
                    </div>
                </section>

                {/* Tricks Selection */}
                <section>
                    <h3 className="text-xs uppercase tracking-wider text-emerald-400 font-bold mb-3">3. Slagen Gehaald</h3>
                    <div className="bg-slate-900 rounded-xl p-6 flex flex-col items-center justify-center border border-slate-700 h-full">
                        <div className="flex items-center justify-between w-full max-w-[200px]">
                            <button 
                                onClick={() => setTricksWon(Math.max(0, tricksWon - 1))}
                                className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 flex items-center justify-center text-xl font-bold text-white transition-all active:scale-95"
                            >
                                -
                            </button>
                            <div className="flex flex-col items-center">
                                <span className={`text-5xl font-bold tabular-nums ${
                                    tricksWon >= (currentContractDef?.target || 0) ? 'text-emerald-400' : 'text-red-400'
                                }`}>
                                    {tricksWon}
                                </span>
                            </div>
                            <button 
                                onClick={() => setTricksWon(Math.min(13, tricksWon + 1))}
                                className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 flex items-center justify-center text-xl font-bold text-white transition-all active:scale-95"
                            >
                                +
                            </button>
                        </div>
                        <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-mono border border-slate-700">
                            Doel: {currentContractDef?.target}
                        </div>
                    </div>
                </section>
              </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-700 bg-slate-900 flex justify-end space-x-3 shrink-0">
            <button onClick={onCancel} className="px-5 py-3 rounded-lg font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                Annuleren
            </button>
            <button 
                onClick={handleSubmit}
                disabled={!isValid}
                className={`px-8 py-3 rounded-lg font-bold text-lg flex items-center shadow-xl transition-all ${
                    isValid 
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 hover:scale-[1.02] text-white ring-1 ring-emerald-400/50' 
                    : 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'
                }`}
            >
                <Check className="w-5 h-5 mr-2" />
                Score Opslaan
            </button>
        </div>
      </div>
    </div>
  );
};