import type { Move, RoundResult, MatchResult, Strategy } from './types';
import { getPayoff } from './types';

/**
 * Play a single round between two strategies
 */
export function playRound(
  player1: Strategy,
  player2: Strategy,
  p1History: Move[],
  p2History: Move[],
  roundIndex: number
): RoundResult {
  const p1Move = player1.getMove([...p1History], [...p2History], roundIndex);
  const p2Move = player2.getMove([...p2History], [...p1History], roundIndex);

  return {
    player1Move: p1Move,
    player2Move: p2Move,
    player1Score: getPayoff(p1Move, p2Move),
    player2Score: getPayoff(p2Move, p1Move),
  };
}

/**
 * Play a full match between two strategies
 */
export function playMatch(
  player1: Strategy,
  player2: Strategy,
  numRounds: number = 10
): MatchResult {
  const rounds: RoundResult[] = [];
  const p1History: Move[] = [];
  const p2History: Move[] = [];

  for (let i = 0; i < numRounds; i++) {
    const result = playRound(player1, player2, p1History, p2History, i);
    rounds.push(result);
    p1History.push(result.player1Move);
    p2History.push(result.player2Move);
  }

  return {
    rounds,
    player1TotalScore: rounds.reduce((sum, r) => sum + r.player1Score, 0),
    player2TotalScore: rounds.reduce((sum, r) => sum + r.player2Score, 0),
  };
}

/**
 * Play a match where player 1 is the human
 */
export function playInteractiveRound(
  playerMove: Move,
  opponent: Strategy,
  playerHistory: Move[],
  opponentHistory: Move[],
  roundIndex: number
): RoundResult {
  const opponentMove = opponent.getMove([...opponentHistory], [...playerHistory], roundIndex);

  return {
    player1Move: playerMove,
    player2Move: opponentMove,
    player1Score: getPayoff(playerMove, opponentMove),
    player2Score: getPayoff(opponentMove, playerMove),
  };
}

/**
 * Run a round-robin tournament
 */
export function runTournament(
  strategies: Strategy[],
  roundsPerMatch: number = 10,
  matchesPerPairing: number = 5
): Map<string, number> {
  const scores = new Map<string, number>();

  strategies.forEach((s) => scores.set(s.id, 0));

  for (let i = 0; i < strategies.length; i++) {
    for (let j = i; j < strategies.length; j++) {
      for (let m = 0; m < matchesPerPairing; m++) {
        const result = playMatch(strategies[i], strategies[j], roundsPerMatch);
        scores.set(
          strategies[i].id,
          (scores.get(strategies[i].id) || 0) + result.player1TotalScore
        );
        scores.set(
          strategies[j].id,
          (scores.get(strategies[j].id) || 0) + result.player2TotalScore
        );
      }
    }
  }

  return scores;
}

/**
 * Run one generation of population evolution
 */
export function evolvePopulation(
  population: { strategyId: string; count: number }[],
  strategies: Strategy[],
  roundsPerMatch: number = 10
): { strategyId: string; count: number }[] {
  const strategyMap = new Map(strategies.map((s) => [s.id, s]));
  const totalPop = population.reduce((sum, p) => sum + p.count, 0);

  // Calculate average score for each strategy
  const avgScores = new Map<string, number>();

  for (const entry of population) {
    if (entry.count === 0) continue;
    let totalScore = 0;
    let matchCount = 0;

    for (const opponent of population) {
      if (opponent.count === 0) continue;
      const s1 = strategyMap.get(entry.strategyId)!;
      const s2 = strategyMap.get(opponent.strategyId)!;
      const result = playMatch(s1, s2, roundsPerMatch);

      // Weight by opponent's population proportion
      const weight = opponent.strategyId === entry.strategyId
        ? opponent.count - 1
        : opponent.count;

      totalScore += result.player1TotalScore * weight;
      matchCount += weight;
    }

    avgScores.set(entry.strategyId, matchCount > 0 ? totalScore / matchCount : 0);
  }

  // Calculate new population based on relative fitness
  const totalFitness = Array.from(avgScores.entries()).reduce(
    (sum, [id, score]) => {
      const count = population.find((p) => p.strategyId === id)?.count || 0;
      return sum + Math.max(0, score + 10) * count; // +10 offset to keep positive
    },
    0
  );

  if (totalFitness === 0) return population;

  const newPopulation = population.map((entry) => {
    const fitness = Math.max(0, (avgScores.get(entry.strategyId) || 0) + 10);
    const proportion = (fitness * entry.count) / totalFitness;
    return {
      strategyId: entry.strategyId,
      count: Math.max(0, Math.round(proportion * totalPop)),
    };
  });

  // Adjust rounding errors
  const newTotal = newPopulation.reduce((sum, p) => sum + p.count, 0);
  if (newTotal !== totalPop && newPopulation.length > 0) {
    // Add/remove from the largest group
    const largest = newPopulation.reduce((max, p) =>
      p.count > max.count ? p : max
    );
    largest.count += totalPop - newTotal;
  }

  return newPopulation;
}
