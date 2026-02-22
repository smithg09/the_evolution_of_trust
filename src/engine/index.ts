export type { Move, RoundResult, MatchResult, Strategy } from './types';
export { PAYOFF, getPayoff } from './types';
export { playMatch, playInteractiveRound, runTournament, evolvePopulation } from './game';
export {
  ALL_STRATEGIES,
  getStrategyById,
  copycat,
  alwaysCooperate,
  alwaysCheat,
  grudger,
  detective,
  copykitten,
  random,
} from './strategies';
