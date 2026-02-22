
import { motion } from 'framer-motion';
import './PayoffMatrix.css';

interface PayoffMatrixProps {
  highlightCell?: [number, number] | null;
}

export default function PayoffMatrix({ highlightCell }: PayoffMatrixProps) {
  const cells = [
    { row: 0, col: 0, p1: '3', p2: '3', label: 'Both Cooperate' },
    { row: 0, col: 1, p1: '0', p2: '5', label: 'You Cooperate, They Cheat' },
    { row: 1, col: 0, p1: '5', p2: '0', label: 'You Cheat, They Cooperate' },
    { row: 1, col: 1, p1: '1', p2: '1', label: 'Both Cheat' },
  ];

  return (
    <div className="payoff-matrix-container">
      {/* Decorative circles for headers */}
      <div className="payoff-matrix-label payoff-matrix-label--top-left">
        <div className="payoff-matrix-circle payoff-matrix-circle--green"></div>
      </div>
      <div className="payoff-matrix-label payoff-matrix-label--top-right">
        <div className="payoff-matrix-circle payoff-matrix-circle--green"></div>
      </div>
      <div className="payoff-matrix-label payoff-matrix-label--bottom-left">
        <div className="payoff-matrix-circle payoff-matrix-circle--red"></div>
      </div>
      <div className="payoff-matrix-label payoff-matrix-label--bottom-right">
        <div className="payoff-matrix-circle payoff-matrix-circle--red"></div>
      </div>

      <div className="payoff-matrix-diamond">
        {cells.map((cell, i) => {
          const isHighlighted = highlightCell && highlightCell[0] === cell.row && highlightCell[1] === cell.col;
          const isDimmed = highlightCell && !isHighlighted;
          return (
            <motion.div
              key={i}
              className={`payoff-matrix-cell ${isHighlighted ? 'payoff-matrix-cell--highlight' : ''} ${isDimmed ? 'payoff-matrix-cell--dimmed' : ''}`}
              whileHover={{ scale: 1.05 }}
              animate={isHighlighted ? { scale: [1, 1.06, 1] } : { scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="payoff-matrix-content">
                <span className="payoff-matrix-score payoff-matrix-score--you">{cell.p1}</span>
                <span className="payoff-matrix-score payoff-matrix-score--them">{cell.p2}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
