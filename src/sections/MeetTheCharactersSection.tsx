import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Section from '../components/Section';
import CoinSlot from '../components/CoinSlot';
import RoundDisplay from '../components/RoundDisplay';
import CharacterCard from '../components/CharacterCard';
import { getStrategyIcon } from '../components/strategyIcons';
import { ScorePopup, TapeStrip } from '../components/SketchElements';
import type { Move, RoundResult, Strategy } from '../engine';
import { playInteractiveRound, copycat, alwaysCooperate, alwaysCheat } from '../engine';
import './MeetTheCharactersSection.css';

interface MeetTheCharactersSectionProps {
  onComplete: () => void;
}

export default function MeetTheCharactersSection({ onComplete }: MeetTheCharactersSectionProps) {
  const [phase, setPhase] = useState<'intro' | 'play-cheat' | 'play-cooperate' | 'play-copycat' | 'reveal'>('intro');
  const [rounds, setRounds] = useState<RoundResult[]>([]);
  const [playerHistory, setPlayerHistory] = useState<Move[]>([]);
  const [opponentHistory, setOpponentHistory] = useState<Move[]>([]);
  const [currentOpponent, setCurrentOpponent] = useState<Strategy>(alwaysCheat);
  const [matchScores, setMatchScores] = useState<Map<string, { you: number; them: number }>>(new Map());

  const totalRounds = 5;

  const handleChoice = useCallback(
    (move: Move) => {
      const result = playInteractiveRound(
        move,
        currentOpponent,
        playerHistory,
        opponentHistory,
        rounds.length
      );
      const newRounds = [...rounds, result];
      const newPlayerHistory = [...playerHistory, result.player1Move];
      const newOpponentHistory = [...opponentHistory, result.player2Move];

      setRounds(newRounds);
      setPlayerHistory(newPlayerHistory);
      setOpponentHistory(newOpponentHistory);

      if (newRounds.length >= totalRounds) {
        const youTotal = newRounds.reduce((s, r) => s + r.player1Score, 0);
        const themTotal = newRounds.reduce((s, r) => s + r.player2Score, 0);
        setMatchScores((prev) => {
          const next = new Map(prev);
          next.set(currentOpponent.id, { you: youTotal, them: themTotal });
          return next;
        });
      }
    },
    [currentOpponent, playerHistory, opponentHistory, rounds]
  );

  const startMatch = (opponent: Strategy, nextPhase: typeof phase) => {
    setCurrentOpponent(opponent);
    setRounds([]);
    setPlayerHistory([]);
    setOpponentHistory([]);
    setPhase(nextPhase);
  };

  const opponents = [
    { strategy: alwaysCheat, phase: 'play-cheat' as const, label: 'Always Cheat' },
    { strategy: alwaysCooperate, phase: 'play-cooperate' as const, label: 'Always Cooperate' },
    { strategy: copycat, phase: 'play-copycat' as const, label: 'Copycat' },
  ];

  const isPlaying = phase.startsWith('play-');
  const matchComplete = rounds.length >= totalRounds;
  const currentOpponentIndex = opponents.findIndex((o) => o.phase === phase);

  return (
    <Section className="meet-section" dark>
      <div className="meet-section__content">
        <motion.h2 className="section-title" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Meet The Characters
        </motion.h2>

        <AnimatePresence mode="wait">
          {phase === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="meet-section__intro"
            >
              <p className="narrative-text">
                In a one-shot game, it always makes sense to cheat. But what about when you play
                the same person <strong>multiple rounds</strong>?
              </p>
              <p className="narrative-text">
                Let's meet three characters and play 5 rounds against each. Watch how different
                strategies lead to different outcomes.
              </p>

              <div className="meet-section__characters">
                {opponents.map(({ strategy }) => (
                  <CharacterCard key={strategy.id} strategy={strategy} />
                ))}
              </div>

              <motion.button
                className="btn btn--primary"
                onClick={() => startMatch(alwaysCheat, 'play-cheat')}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                First up: Always Cheat →
              </motion.button>
            </motion.div>
          )}

          {isPlaying && (
            <motion.div
              key={phase}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="meet-section__play"
            >
              <CharacterCard strategy={currentOpponent} compact />

              <p className="narrative-text" style={{ marginTop: '1rem' }}>
                {currentOpponent.description}
              </p>

              <RoundDisplay
                rounds={rounds}
                currentRound={rounds.length - 1}
                opponentLabel={currentOpponent.name}
                opponentId={currentOpponent.id}
              />

              {/* Score popup after each round */}
              <div style={{ position: 'relative', height: 0, overflow: 'visible' }}>
                <AnimatePresence>
                  {rounds.length > 0 && (
                    <ScorePopup
                      score={rounds[rounds.length - 1].player1Score}
                      id={rounds.length}
                    />
                  )}
                </AnimatePresence>
              </div>

              <p className="meet-section__round-label">
                Round {Math.min(rounds.length + 1, totalRounds)} of {totalRounds}
              </p>
              {!matchComplete && (
                <CoinSlot 
                  onChoice={handleChoice} 
                  disabled={matchComplete}
                  opponentChoice={rounds.length > 0 ? rounds[rounds.length - 1].player2Move : null} 
                />
              )}

              {matchComplete && (
                <motion.div
                  className="meet-section__match-done"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="narrative-text">
                    Match complete! Now let's {currentOpponentIndex < opponents.length - 1 ? 'try the next opponent.' : 'see what we learned.'}
                  </p>
                  {currentOpponentIndex < opponents.length - 1 ? (
                    <motion.button
                      className="btn btn--primary"
                      onClick={() => {
                        const next = opponents[currentOpponentIndex + 1];
                        startMatch(next.strategy, next.phase);
                      }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Next: {opponents[currentOpponentIndex + 1].strategy.name} →
                    </motion.button>
                  ) : (
                    <motion.button
                      className="btn btn--primary"
                      onClick={() => setPhase('reveal')}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      What did we learn? →
                    </motion.button>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}

          {phase === 'reveal' && (
            <motion.div
              key="reveal"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="meet-section__reveal"
            >
              <div className="meet-section__scores-summary">
                <TapeStrip className="meet-section__tape" rotation={-2} />
                <h3>Your Results</h3>
                {opponents.map(({ strategy }) => {
                  const score = matchScores.get(strategy.id);
                  return (
                    <div key={strategy.id} className="meet-section__score-row">
                      <span
                        className="meet-section__score-emoji"
                        style={{ color: strategy.color }}
                      >
                        {getStrategyIcon(strategy.id, 20)}
                      </span>
                      <span className="meet-section__score-name">{strategy.name}</span>
                      <span
                        className="meet-section__score-val"
                        style={{ color: (score?.you || 0) > 0 ? 'var(--neon-green)' : 'var(--neon-red)' }}
                      >
                        You: {score?.you ?? 0}
                      </span>
                      <span
                        className="meet-section__score-val"
                        style={{ color: (score?.them || 0) > 0 ? 'var(--neon-green)' : 'var(--neon-red)' }}
                      >
                        Them: {score?.them ?? 0}
                      </span>
                    </div>
                  );
                })}
              </div>

              <p className="narrative-text">
                Interesting, right? Against a cheater, you can't win by being nice. Against a
                cooperator, you could exploit them. But <strong>Copycat</strong> — who plays
                tit-for-tat — encourages you to cooperate for mutual benefit.
              </p>

              <p className="narrative-text">
                But what if we scaled this up? What happens when <em>all</em> these strategies
                compete in a <strong>tournament</strong>?
              </p>

              <motion.button
                className="btn btn--primary"
                onClick={onComplete}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Run the Tournament →
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Section>
  );
}
