import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { MachineSVG, ConfettiBurst } from './SketchElements';
import type { Move } from '../engine';
import { playCoinCooperate, playCheat } from '../engine/sounds';
import './CoinSlot.css';

interface CoinSlotProps {
  onChoice: (move: Move) => void;
  disabled?: boolean;
  size?: 'normal' | 'large';
  opponentChoice?: Move | null;
  showMachine?: boolean;
}

export default function CoinSlot({ onChoice, disabled = false, size = 'normal', opponentChoice = null, showMachine = true }: CoinSlotProps) {
  const [lastChoice, setLastChoice] = useState<Move | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleChoice = (move: Move) => {
    if (disabled) return;
    setLastChoice(move);
    setShowConfetti(move === 'cooperate');
    if (move === 'cooperate') playCoinCooperate(); else playCheat();
    onChoice(move);
    setTimeout(() => {
      setLastChoice(null);
      setShowConfetti(false);
    }, 1500);
  };

  // Keyboard shortcuts: C = cooperate, X = cheat
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const key = e.key.toLowerCase();
      if (key === 'c') handleChoice('cooperate');
      if (key === 'x') handleChoice('cheat');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <div className={`coin-slot coin-slot--${size}`}>
      {/* Machine illustration */}
      {showMachine && (
        <div className="coin-slot__machine-wrap">
          <MachineSVG className={lastChoice ? 'anim-shake' : ''} playerChoice={lastChoice} opponentChoice={lastChoice ? opponentChoice : null} />
          <ConfettiBurst active={showConfetti} />
        </div>
      )}

      {/* Arcade-style action buttons */}
      <div className="coin-slot__prompt">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M12 4v14M6 14l6 6 6-6" stroke="var(--text-muted)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>What will you do?</span>
      </div>

      <div className="coin-slot__buttons">
        <motion.button
          className="coin-slot__btn coin-slot__btn--cooperate"
          onClick={() => handleChoice('cooperate')}
          disabled={disabled}
          whileHover={{ scale: 1.06, y: -4, rotate: -1 }}
          whileTap={{ scale: 0.92, y: 2 }}
        >
          <span className="coin-slot__btn-bg" />
          <Icon icon="noto:coin" className="coin-slot__icon" />
          <span className="coin-slot__label">Cooperate</span>
          <span className="coin-slot__sub">Put in coin</span>
          <kbd className="coin-slot__kbd">C</kbd>
        </motion.button>

        <div className="coin-slot__or">
          <svg width="40" height="20" viewBox="0 0 40 20" fill="none">
            <path d="M0 10h14M26 10h14" stroke="var(--sketch-border)" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 3" />
            <text x="20" y="14" textAnchor="middle" fontSize="11" fontFamily="Patrick Hand, cursive" fill="var(--text-muted)" fontWeight="700">OR</text>
          </svg>
        </div>

        <motion.button
          className="coin-slot__btn coin-slot__btn--cheat"
          onClick={() => handleChoice('cheat')}
          disabled={disabled}
          whileHover={{ scale: 1.06, y: -4, rotate: 1 }}
          whileTap={{ scale: 0.92, y: 2 }}
        >
          <span className="coin-slot__btn-bg" />
          <Icon icon="noto:raised-hand" className="coin-slot__icon" />
          <span className="coin-slot__label">Cheat</span>
          <span className="coin-slot__sub">Keep coin</span>
          <kbd className="coin-slot__kbd">X</kbd>
        </motion.button>
      </div>
    </div>
  );
}
