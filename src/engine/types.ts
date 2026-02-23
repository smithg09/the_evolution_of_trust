// Core game types for The Trust Paradox

export type Move = 'cooperate' | 'cheat';

export interface RoundResult {
  player1Move: Move;
  player2Move: Move;
  player1Score: number;
  player2Score: number;
}

export interface MatchResult {
  rounds: RoundResult[];
  player1TotalScore: number;
  player2TotalScore: number;
}

export interface Strategy {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
  shortDescription: string;
  getMove: (myHistory: Move[], opponentHistory: Move[], roundIndex: number) => Move;
}

export interface TournamentEntry {
  strategy: Strategy;
  totalScore: number;
  matchResults: Map<string, number>;
}

export interface PopulationMember {
  strategy: Strategy;
  score: number;
}

export interface GameSection {
  id: string;
  title: string;
  component: string;
}

// Payoff matrix constants
export const PAYOFF = {
  BOTH_COOPERATE: 3,     // Both put in coin: each gets +3
  BOTH_CHEAT: 1,         // Neither puts in coin: each gets +1
  CHEATER_WINS: 5,       // You cheat, they cooperate: you get +5
  SUCKER_LOSES: 0,       // You cooperate, they cheat: you get 0
} as const;

export function getPayoff(myMove: Move, opponentMove: Move): number {
  if (myMove === 'cooperate' && opponentMove === 'cooperate') return PAYOFF.BOTH_COOPERATE;
  if (myMove === 'cheat' && opponentMove === 'cheat') return PAYOFF.BOTH_CHEAT;
  if (myMove === 'cheat' && opponentMove === 'cooperate') return PAYOFF.CHEATER_WINS;
  return PAYOFF.SUCKER_LOSES; // cooperate vs cheat
}
