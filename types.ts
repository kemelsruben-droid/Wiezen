export interface Player {
  id: string;
  name: string;
  score: number;
}

export enum ContractType {
  PASS = 'Iedereen Past', // New
  ALONE = 'Alleen Gaan (5)',
  NORMAL = 'Vraag & Mee (8)',
  TROEL = 'Troel (8)',
  PICCOLO = 'Piccolo (1)',
  ABONDANCE = 'Abondance (9)',
  MISERIE = 'Miserie',
  MISERIE_TABLE = 'Miserie op Tafel',
  SOLO = 'Solo (13)',
  SOLO_SLIM = 'Solo Slim (13)'
}

export interface Round {
  id: string;
  roundNumber: number;
  contract: ContractType;
  players: string[];
  activePlayerIds: string[];
  defendingPlayerIds: string[];
  tricksWon: number;
  points: number;
  result: Record<string, number>;
  timestamp: number;
  isDoubled?: boolean; // New: tracks if this round was played for double points
}

export interface GameState {
  players: Player[];
  rounds: Round[];
  dealerIndex: number;
  gameStarted: boolean;
  gameFinished: boolean; // New
  nextRoundDoubled: boolean; // New: tracks if the NEXT round should be double
}

export interface ScoreConfig {
  baseStake: number;
  perTrick: number;
  multiplier: {
    solo: number;
    abondance: number;
    miserie: number;
    soloslim: number;
  };
}