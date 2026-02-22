import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import type { Strategy } from '../engine';
import { getStrategyIcon } from './strategyIcons';
import './CharacterCard.css';

interface CharacterCardProps {
  strategy: Strategy;
  score?: number;
  onClick?: () => void;
  selected?: boolean;
  compact?: boolean;
}

export default function CharacterCard({
  strategy,
  score,
  onClick,
  selected = false,
  compact = false,
}: CharacterCardProps) {
  return (
    <motion.div
      className={`character-card ${selected ? 'character-card--selected' : ''} ${compact ? 'character-card--compact' : ''}`}
      style={{ '--char-color': strategy.color, cursor: onClick ? 'pointer' : 'default' } as CSSProperties}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.03, y: -2 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      layout
    >
      <div className="character-card__emoji">
        {getStrategyIcon(strategy.id) ?? strategy.emoji}
      </div>
      <div className="character-card__info">
        <h3 className="character-card__name">{strategy.name}</h3>
        {!compact && <p className="character-card__desc">{strategy.shortDescription}</p>}
      </div>
      {score !== undefined && (
        <div className="character-card__score">
          <span className="character-card__score-value">{score}</span>
          <span className="character-card__score-label">pts</span>
        </div>
      )}
    </motion.div>
  );
}
