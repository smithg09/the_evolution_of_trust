import type { Strategy, Move } from './types';

/**
 * Always Cooperate - The naive cooperator
 */
export const alwaysCooperate: Strategy = {
  id: 'always-cooperate',
  name: 'Always Cooperate',
  emoji: 'AC',
  color: '#4ade80',
  description:
    'This player always cooperates, no matter what. They believe in unconditional kindness, even when it hurts them.',
  shortDescription: 'Always puts in the coin. Endlessly trusting.',
  getMove: () => 'cooperate',
};

/**
 * Always Cheat - The exploiter
 */
export const alwaysCheat: Strategy = {
  id: 'always-cheat',
  name: 'Always Cheat',
  emoji: 'AX',
  color: '#f87171',
  description:
    'This player always cheats, no matter what. They exploit everyone they meet without remorse.',
  shortDescription: 'Never puts in the coin. Pure selfishness.',
  getMove: () => 'cheat',
};

/**
 * Copycat (Tit for Tat) - The reciprocator
 */
export const copycat: Strategy = {
  id: 'copycat',
  name: 'Copycat',
  emoji: 'CC',
  color: '#60a5fa',
  description:
    "Copycat starts by cooperating, then copies whatever you did last round. It's the golden rule: treat others as they treat you.",
  shortDescription: 'Cooperates first, then copies your last move.',
  getMove: (_myHistory: Move[], opponentHistory: Move[]) => {
    if (opponentHistory.length === 0) return 'cooperate';
    return opponentHistory[opponentHistory.length - 1];
  },
};

/**
 * Grudger - Cooperates until betrayed, then always cheats
 */
export const grudger: Strategy = {
  id: 'grudger',
  name: 'Grudger',
  emoji: 'GR',
  color: '#c084fc',
  description:
    'Grudger cooperates at first, but the moment you cheat them even once, they hold a grudge forever and always cheat back.',
  shortDescription: 'Cooperates until betrayed, then cheats forever.',
  getMove: (_myHistory: Move[], opponentHistory: Move[]) => {
    if (opponentHistory.includes('cheat')) return 'cheat';
    return 'cooperate';
  },
};

/**
 * Detective - Tests you, then decides
 */
export const detective: Strategy = {
  id: 'detective',
  name: 'Detective',
  emoji: 'DT',
  color: '#fbbf24',
  description:
    "Detective plays a specific pattern: Cooperate, Cheat, Cooperate, Cooperate. If you retaliate against their cheat, they'll play Copycat. If you don't, they'll exploit you forever.",
  shortDescription: 'Tests you first, then adapts.',
  getMove: (_myHistory: Move[], opponentHistory: Move[], roundIndex: number) => {
    // First 4 moves: C, D, C, C
    const openingMoves: Move[] = ['cooperate', 'cheat', 'cooperate', 'cooperate'];
    if (roundIndex < 4) return openingMoves[roundIndex];

    // Check if opponent retaliated during first 4 rounds
    const opponentRetaliated = opponentHistory.slice(0, 4).includes('cheat');

    if (opponentRetaliated) {
      // Play copycat
      return opponentHistory[opponentHistory.length - 1];
    } else {
      // Exploit
      return 'cheat';
    }
  },
};

/**
 * Random - 50/50 chance
 */
export const random: Strategy = {
  id: 'random',
  name: 'Random',
  emoji: 'RN',
  color: '#fb923c',
  description:
    'Random flips a coin each round. Cooperation or betrayal — determined by pure chance.',
  shortDescription: '50/50 chance of cooperating or cheating.',
  getMove: () => (Math.random() < 0.5 ? 'cooperate' : 'cheat'),
};

/**
 * Copykitten - Like Copycat but forgives once
 */
export const copykitten: Strategy = {
  id: 'copykitten',
  name: 'Copykitten',
  emoji: 'CK',
  color: '#f472b6',
  description:
    "Like Copycat, but more forgiving. Copykitten only cheats back if you cheat them twice in a row. One cheat? They'll let it slide.",
  shortDescription: 'Only retaliates after two cheats in a row.',
  getMove: (_myHistory: Move[], opponentHistory: Move[]) => {
    if (opponentHistory.length < 2) return 'cooperate';
    const lastTwo = opponentHistory.slice(-2);
    if (lastTwo[0] === 'cheat' && lastTwo[1] === 'cheat') return 'cheat';
    return 'cooperate';
  },
};

// All strategies
export const ALL_STRATEGIES: Strategy[] = [
  copycat,
  alwaysCooperate,
  alwaysCheat,
  grudger,
  detective,
  copykitten,
  random,
];

export function getStrategyById(id: string): Strategy | undefined {
  return ALL_STRATEGIES.find((s) => s.id === id);
}
