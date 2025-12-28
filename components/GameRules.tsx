import React from 'react';
import { X, BookOpen } from 'lucide-react';
import { THEME } from '../constants';

interface GameRulesProps {
  onClose: () => void;
}

export const GameRules: React.FC<GameRulesProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className={`w-full max-w-2xl ${THEME.card} rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]`}>
        <div className="p-5 bg-slate-900 border-b border-slate-700 flex justify-between items-center shrink-0">
          <h2 className="text-xl font-bold text-white flex items-center">
            <BookOpen className="mr-3 text-emerald-500 w-6 h-6" />
            Speluitleg & Contracten
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-300 leading-relaxed">
          <section>
            <h3 className="text-lg font-bold text-white mb-2 text-emerald-400">Volgorde van Waarde</h3>
            <p className="text-sm">Het hoogst geklasseerde spel heeft voorrang (Solo > Abondance > Troel > Vragen).</p>
          </section>

          <section className="space-y-4">
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
              <h4 className="font-bold text-white mb-1">Troel (Team)</h4>
              <p className="text-sm">Heeft iemand 3 azen? Dan roept die "Troel". De 4de aas is partner. Samen moeten ze <strong className="text-white">8 slagen</strong> halen. Kleur van de 4de aas is troef.</p>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
              <h4 className="font-bold text-white mb-1">Vragen & Meegaan (Team)</h4>
              <p className="text-sm">Speler vraagt partner om samen <strong className="text-white">8 slagen</strong> te halen. De "vrager" kiest troef.</p>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
              <h4 className="font-bold text-white mb-1">Alleen Gaan (Solo)</h4>
              <p className="text-sm">Als niemand meegaat, kan de vrager alleen spelen. Hij moet <strong className="text-white">5 slagen</strong> halen (sommige regio's 6). Zelf troef kiezen.</p>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
              <h4 className="font-bold text-white mb-1">Abondance (Solo)</h4>
              <p className="text-sm">Alleen spelen voor minstens <strong className="text-white">9 slagen</strong>. Zelf troef kiezen en zelf uitkomen.</p>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
              <h4 className="font-bold text-white mb-1">Miserie (Solo)</h4>
              <p className="text-sm">Geen enkele slag halen (<strong className="text-white">0 slagen</strong>). Geen troef. Als 3 spelers miserie gaan, moet de 4de ook.</p>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
              <h4 className="font-bold text-white mb-1">Piccolo (Solo)</h4>
              <p className="text-sm">Exact <strong className="text-white">1 slag</strong> halen. Geen troef.</p>
            </div>

             <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
              <h4 className="font-bold text-white mb-1">Solo (Solo)</h4>
              <p className="text-sm">Alle <strong className="text-white">13 slagen</strong> halen. Je kiest zelf troef.</p>
            </div>
          </section>
          
          <section className="bg-emerald-900/20 p-4 rounded-xl border border-emerald-800/50">
             <h3 className="text-emerald-400 font-bold mb-2">Pasregels</h3>
             <p className="text-sm">Indien alle 4 de spelers passen, worden de kaarten opnieuw geschud. De punten voor de <strong>volgende ronde tellen dubbel</strong>.</p>
          </section>
        </div>
        
        <div className="p-5 border-t border-slate-700 bg-slate-900 flex justify-end">
             <button onClick={onClose} className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 font-semibold">Sluiten</button>
        </div>
      </div>
    </div>
  );
};