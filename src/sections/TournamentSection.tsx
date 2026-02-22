import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import Section from '../components/Section';
import CharacterCard from '../components/CharacterCard';
import { TrophySVG, ConfettiBurst } from '../components/SketchElements';
import { getStrategyIcon } from '../components/strategyIcons';
import { ALL_STRATEGIES, runTournament } from '../engine';
import { playTournamentStart, playFanfare } from '../engine/sounds';
import './TournamentSection.css';

interface TournamentSectionProps {
  onComplete: () => void;
}

interface TournamentResult {
  id: string;
  name: string;
  emoji: string;
  color: string;
  score: number;
}

export default function TournamentSection({ onComplete }: TournamentSectionProps) {
  const [phase, setPhase] = useState<'intro' | 'running' | 'results' | 'analysis'>('intro');
  const [results, setResults] = useState<TournamentResult[]>([]);
  const hasRun = useRef(false);

  const runTournamentSim = () => {
    if (hasRun.current) return;
    hasRun.current = true;
    setPhase('running');
    playTournamentStart();

    setTimeout(() => {
      const scores = runTournament(ALL_STRATEGIES, 10, 5);
      const sorted = ALL_STRATEGIES.map((s) => ({
        id: s.id,
        name: s.name,
        emoji: s.emoji,
        color: s.color,
        score: scores.get(s.id) || 0,
      })).sort((a, b) => b.score - a.score);

      setResults(sorted);
      setPhase('results');
      playFanfare();
    }, 1500);
  };

  return (
    <Section className="tournament-section">
      <div className="tournament-section__content">
        <motion.h2 className="section-title" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          The Tournament
        </motion.h2>

        <AnimatePresence mode="wait">
          {phase === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="tournament-section__intro"
            >
              <p className="narrative-text">
                Now let's see what happens when <strong>all the strategies</strong> compete against
                each other in a round-robin tournament.
              </p>
              <p className="narrative-text">
                Each strategy plays <strong>10 rounds</strong> against every other strategy (and itself!),
                repeated <strong>5 times</strong> each. The one with the highest total score wins.
              </p>

              <div className="tournament-section__lineup">
                <div className="tournament-section__vs-badge">
                  <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                    <circle cx="30" cy="30" r="26" fill="rgba(231,76,60,0.08)" stroke="var(--neon-red)" strokeWidth="2.5" strokeDasharray="6 3" />
                    <text x="30" y="36" textAnchor="middle" fontSize="18" fontFamily="Patrick Hand, cursive" fill="var(--neon-red)" fontWeight="700">VS</text>
                  </svg>
                </div>
                {ALL_STRATEGIES.map((s) => (
                  <CharacterCard key={s.id} strategy={s} compact />
                ))}
              </div>

              <motion.button
                className="btn btn--primary"
                onClick={runTournamentSim}
                whileHover={{ scale: 1.05, rotate: -1 }}
                whileTap={{ scale: 0.95 }}
              >
                <TrophySVG size={24} />
                Run Tournament
              </motion.button>
            </motion.div>
          )}

          {phase === 'running' && (
            <motion.div
              key="running"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="tournament-section__running"
            >
              {/* Network Graph Animation */}
              <div className="tournament-section__network-anim">
                <svg width="300" height="300" viewBox="0 0 300 300">
                  {/* Connections */}
                  {ALL_STRATEGIES.map((s1, i) => 
                    ALL_STRATEGIES.slice(i + 1).map((s2, j) => {
                      const angle1 = (i / ALL_STRATEGIES.length) * Math.PI * 2;
                      const angle2 = ((i + 1 + j) / ALL_STRATEGIES.length) * Math.PI * 2;
                      const x1 = 150 + Math.cos(angle1) * 100;
                      const y1 = 150 + Math.sin(angle1) * 100;
                      const x2 = 150 + Math.cos(angle2) * 100;
                      const y2 = 150 + Math.sin(angle2) * 100;
                      
                      return (
                        <motion.line
                          key={`${s1.id}-${s2.id}`}
                          x1={x1} y1={y1} x2={x2} y2={y2}
                          stroke="rgba(255,255,255,0.2)"
                          strokeWidth="2"
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ 
                            pathLength: [0, 1, 0],
                            opacity: [0, 1, 0],
                            stroke: [s1.color, '#fff', s2.color]
                          }}
                          transition={{ 
                            duration: 1.5, 
                            repeat: Infinity, 
                            delay: Math.random() * 2 
                          }}
                        />
                      );
                    })
                  )}
                  
                  {/* Nodes */}
                  {ALL_STRATEGIES.map((s, i) => {
                    const angle = (i / ALL_STRATEGIES.length) * Math.PI * 2;
                    const x = 150 + Math.cos(angle) * 100;
                    const y = 150 + Math.sin(angle) * 100;
                    
                    return (
                      <g key={s.id} transform={`translate(${x}, ${y})`}>
                        <circle r="20" fill="var(--bg-card)" stroke={s.color} strokeWidth="3" />
                        <foreignObject x="-11" y="-11" width="22" height="22" style={{ overflow: 'visible' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, color: s.color }}>
                            {getStrategyIcon(s.id, 14)}
                          </div>
                        </foreignObject>
                      </g>
                    );
                  })}
                </svg>
              </div>
              <p className="narrative-text" style={{ fontFamily: "'Patrick Hand', cursive", fontSize: '1.3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <Icon icon="noto:crossed-swords" width={24} height={24} /> Battles in progress...
              </p>
            </motion.div>
          )}

          {(phase === 'results' || phase === 'analysis') && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="tournament-section__results"
            >
              {/* Winner trophy */}
              {results.length > 0 && (
                <motion.div
                  className="tournament-section__winner"
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
                >
                  <TrophySVG size={40} />
                  <span className="tournament-section__winner-name" style={{ color: results[0].color }}>
                    <span style={{ display: 'inline-flex', verticalAlign: 'middle', marginRight: '0.35rem' }}>{getStrategyIcon(results[0].id, 22)}</span>
                    {results[0].name} wins!
                  </span>
                  <ConfettiBurst active={phase === 'results'} />
                </motion.div>
              )}

              <div className="tournament-section__leaderboard">
                {results.map((r, i) => {
                  const medalIcon = i === 0 ? 'noto:1st-place-medal' : i === 1 ? 'noto:2nd-place-medal' : i === 2 ? 'noto:3rd-place-medal' : null;
                  return (
                  <motion.div
                    key={r.id}
                    className="tournament-row"
                    style={{ borderColor: r.color }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="tournament-row__rank">
                      {medalIcon ? <Icon icon={medalIcon} width={22} height={22} /> : `#${i + 1}`}
                    </div>
                    <div className="tournament-row__emoji" style={{ color: r.color }}>{getStrategyIcon(r.id, 24)}</div>
                    <div className="tournament-row__name" style={{ color: r.color }}>
                      {r.name}
                    </div>
                    <div className="tournament-row__score">{r.score}</div>
                  </motion.div>
                  );
                })}
              </div>

              {phase === 'results' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <motion.button
                    className="btn btn--primary"
                    onClick={() => setPhase('analysis')}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    What does this mean? →
                  </motion.button>
                </motion.div>
              )}

              {phase === 'analysis' && (
                <motion.div
                  className="tournament-section__analysis"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="narrative-text">
                    <strong>Copycat wins!</strong> Or at least, it does consistently well. Notice
                    that the "nice" strategies — the ones that are never the first to cheat —
                    tend to score higher.
                  </p>
                  <p className="narrative-text">
                    Being nice isn't about being naive. It's about creating an environment where
                    <strong> mutual cooperation</strong> is possible.
                  </p>
                  <p className="narrative-text">
                    But tournaments aren't real life. In real life, successful strategies
                    <em> spread</em>. What happens when we simulate <strong>evolution</strong>?
                  </p>

                  <motion.button
                    className="btn btn--primary"
                    onClick={onComplete}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Simulate Evolution →
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Section>
  );
}
