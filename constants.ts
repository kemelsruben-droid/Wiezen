import { ContractType } from './types';

export const CONTRACT_OPTIONS = [
  // Team Games (2v2)
  { type: ContractType.NORMAL, label: 'Vraag & Mee', target: 8, min: 0, max: 13, category: 'team' },
  { type: ContractType.TROEL, label: 'Troel', target: 8, min: 0, max: 13, category: 'team' },
  
  // Solo Games (1v3)
  { type: ContractType.ALONE, label: 'Alleen Gaan', target: 5, min: 0, max: 13, category: 'solo' },
  { type: ContractType.PICCOLO, label: 'Piccolo', target: 1, min: 0, max: 13, category: 'solo' },
  { type: ContractType.ABONDANCE, label: 'Abondance', target: 9, min: 9, max: 12, category: 'solo' },
  { type: ContractType.MISERIE, label: 'Miserie', target: 0, min: 0, max: 13, category: 'solo' },
  { type: ContractType.MISERIE_TABLE, label: 'Miserie op Tafel', target: 0, min: 0, max: 13, category: 'solo' },
  { type: ContractType.SOLO, label: 'Solo (13)', target: 13, min: 13, max: 13, category: 'solo' },
  { type: ContractType.SOLO_SLIM, label: 'Solo Slim', target: 13, min: 13, max: 13, category: 'solo' },
];

export const THEME = {
  primary: 'bg-emerald-700 hover:bg-emerald-600 text-white',
  secondary: 'bg-slate-700 hover:bg-slate-600 text-slate-100',
  accent: 'text-emerald-400',
  card: 'bg-slate-800 border border-slate-700',
  background: 'bg-slate-900'
};