import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import Section from '../components/Section';
import CoinSlot from '../components/CoinSlot';
import CharacterCard from '../components/CharacterCard';
import RoundDisplay from '../components/RoundDisplay';
import { getStrategyIcon } from '../components/strategyIcons';import { ScorePopup, NotebookCorner } from '../components/SketchElements';import type { Strategy, Move, RoundResult } from '../engine';
import { ALL_STRATEGIES, playInteractiveRound } from '../engine';
import { playWin, playLose, playMatchComplete, playClick } from '../engine/sounds';
import './SandboxSection.css';

interface SandboxSectionProps {
  onComplete?: () => void;
}

export default function SandboxSection({ onComplete }: SandboxSectionProps) {
  const [hasCompleted, setHasCompleted] = useState(false);
  const [selectedOpponent, setSelectedOpponent] = useState<Strategy>(ALL_STRATEGIES[0]);
  const [rounds, setRounds] = useState<RoundResult[]>([]);
  const [playerHistory, setPlayerHistory] = useState<Move[]>([]);
  const [opponentHistory, setOpponentHistory] = useState<Move[]>([]);
  const totalRounds = 10;

  const handleChoice = useCallback(
    (move: Move) => {
      const result = playInteractiveRound(
        move,
        selectedOpponent,
        playerHistory,
        opponentHistory,
        rounds.length
      );
      setRounds((prev) => [...prev, result]);
      setPlayerHistory((prev) => [...prev, result.player1Move]);
      setOpponentHistory((prev) => [...prev, result.player2Move]);
      // Sound feedback
      if (result.player1Score >= result.player2Score) playWin(); else playLose();
    },
    [selectedOpponent, playerHistory, opponentHistory, rounds]
  );

  const selectOpponent = (s: Strategy) => {
    playClick();
    setSelectedOpponent(s);
    setRounds([]);
    setPlayerHistory([]);
    setOpponentHistory([]);
  };

  const resetMatch = () => {
    setRounds([]);
    setPlayerHistory([]);
    setOpponentHistory([]);
  };

  const surpriseMe = () => {
    playClick();
    const random = ALL_STRATEGIES[Math.floor(Math.random() * ALL_STRATEGIES.length)];
    selectOpponent(random);
  };

  const matchComplete = rounds.length >= totalRounds;

  // Unlock conclusion on first match complete
  if (matchComplete && !hasCompleted) {
    setHasCompleted(true);
    playMatchComplete();
    onComplete?.();
  }

  return (
    <Section className="sandbox-section">
      <div className="sandbox-section__content">
        <motion.h2 className="section-title" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <span className="section-title-icon"><Icon icon="noto:joystick" width={28} height={28} /></span> Sandbox Mode
        </motion.h2>

        <p className="narrative-text">
          Pick any strategy and play {totalRounds} rounds against them. Experiment freely!
        </p>

        <div className="sandbox-section__layout">
          <div className="sandbox-section__sidebar">
            <h3 className="sandbox-section__sidebar-label">Choose Opponent</h3>
            <motion.button
              className="btn btn--ghost sandbox-section__surprise-btn"
              onClick={surpriseMe}
              whileHover={{ scale: 1.05, rotate: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon icon="noto:game-die" width={18} height={18} /> Surprise Me!
            </motion.button>
            <div className="sandbox-section__opponents">
              {ALL_STRATEGIES.map((s) => (
                <CharacterCard
                  key={s.id}
                  strategy={s}
                  compact
                  selected={selectedOpponent.id === s.id}
                  onClick={() => selectOpponent(s)}
                />
              ))}
            </div>
          </div>

          <div className="sandbox-section__main">
            <div className="sandbox-section__opponent-info">
              <NotebookCorner className="sandbox-section__corner" position="top-right" />
              <span
                className="sandbox-section__opponent-emoji"
                style={{ color: selectedOpponent.color, borderColor: `color-mix(in srgb, ${selectedOpponent.color} 40%, transparent)`, background: `color-mix(in srgb, ${selectedOpponent.color} 10%, transparent)` }}
              >
                {getStrategyIcon(selectedOpponent.id, 32)}
              </span>
              <div>
                <h3 style={{ color: selectedOpponent.color, margin: 0 }}>{selectedOpponent.name}</h3>
                <p className="sandbox-section__opponent-desc">{selectedOpponent.description}</p>
              </div>
            </div>

            {rounds.length > 0 && (
              <>
                <RoundDisplay
                  rounds={rounds}
                  currentRound={rounds.length - 1}
                  opponentLabel={selectedOpponent.name}
                  opponentId={selectedOpponent.id}
                />
                {/* Floating score popup */}
                <div style={{ position: 'relative', height: 0, overflow: 'visible' }}>
                  <AnimatePresence>
                    <ScorePopup
                      score={rounds[rounds.length - 1].player1Score}
                      id={rounds.length}
                    />
                  </AnimatePresence>
                </div>
              </>
            )}

            <p className="sandbox-section__round-label">
              Round {Math.min(rounds.length + 1, totalRounds)} of {totalRounds}
            </p>
            <CoinSlot 
              onChoice={handleChoice} 
              disabled={matchComplete}
              opponentChoice={rounds.length > 0 ? rounds[rounds.length - 1].player2Move : null} 
            />

            {matchComplete && (
              <motion.div
                className="sandbox-section__complete"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="narrative-text">Match complete!</p>
                <motion.button
                  className="btn btn--secondary"
                  onClick={resetMatch}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Icon icon="noto:counterclockwise-arrows-button" width={18} height={18} /> Play Again
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
