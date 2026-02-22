import { Icon } from '@iconify/react';
import type { RoundResult } from '../engine';
import { getStrategyIcon } from './strategyIcons';
import './RoundDisplay.css';

interface RoundDisplayProps {
  rounds: RoundResult[];
  currentRound?: number;
  playerLabel?: string;
  opponentLabel?: string;
  opponentEmoji?: string;
  opponentId?: string;
}

export default function RoundDisplay({
  rounds,
  currentRound,
  playerLabel = 'You',
  opponentLabel = 'Them',
  opponentEmoji = 'AI',
  opponentId,
}: RoundDisplayProps) {
  const p1Total = rounds.reduce((s, r) => s + r.player1Score, 0);
  const p2Total = rounds.reduce((s, r) => s + r.player2Score, 0);

  // Pad rounds to show future empty slots (e.g., up to 10)
  const totalSlots = Math.max(10, rounds.length);
  const paddedRounds = Array.from({ length: totalSlots }).map((_, i) => rounds[i] || null);

  return (
    <div className="round-display">
      <div className="round-display__header">
        <div className="round-display__player">
          <span className="round-display__emoji"><Icon icon="noto:person" width={18} height={18} /></span>
          <span>{playerLabel}</span>
        </div>
        <div className="round-display__vs-text">VS</div>
        <div className="round-display__player">
          <span>{opponentLabel}</span>
          <span className="round-display__emoji">
            {opponentId ? getStrategyIcon(opponentId, 18) : opponentEmoji}
          </span>
        </div>
      </div>

      <div className="round-display__board">
        {/* Player 1 Row */}
        <div className="round-display__row">
          <div className="round-display__row-label">P1</div>
          <div className="round-display__track">
            {paddedRounds.map((round, i) => (
              <div
                key={`p1-${i}`}
                className={`round-display__dot ${!round ? 'round-display__dot--empty' :
                    round.player1Move === 'cooperate' ? 'round-display__dot--cooperate' : 'round-display__dot--defect'
                  } ${currentRound === i ? 'round-display__dot--active' : ''}`}
              />
            ))}
          </div>
          <div className="round-display__row-score">{p1Total}</div>
        </div>

        {/* Divider */}
        <div className="round-display__divider" />

        {/* Player 2 Row */}
        <div className="round-display__row">
          <div className="round-display__row-label">P2</div>
          <div className="round-display__track">
            {paddedRounds.map((round, i) => (
              <div
                key={`p2-${i}`}
                className={`round-display__dot ${!round ? 'round-display__dot--empty' :
                    round.player2Move === 'cooperate' ? 'round-display__dot--cooperate' : 'round-display__dot--defect'
                  } ${currentRound === i ? 'round-display__dot--active' : ''}`}
              />
            ))}
          </div>
          <div className="round-display__row-score">{p2Total}</div>
        </div>
      </div>
    </div>
  );
}
