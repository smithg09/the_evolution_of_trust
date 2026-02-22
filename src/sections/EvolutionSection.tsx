import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import Section from '../components/Section';
import { ALL_STRATEGIES, evolvePopulation } from '../engine';
import { getStrategyIcon } from '../components/strategyIcons';
import { playEvolutionTick, playFanfare } from '../engine/sounds';
import './EvolutionSection.css';

interface EvolutionSectionProps {
  onComplete: () => void;
}

interface PopEntry {
  strategyId: string;
  count: number;
}

const INITIAL_POP: PopEntry[] = ALL_STRATEGIES.map((s) => ({
  strategyId: s.id,
  count: Math.round(100 / ALL_STRATEGIES.length),
}));

function getStrategyColor(id: string): string {
  return ALL_STRATEGIES.find((s) => s.id === id)?.color || '#888';
}

function getStrategyName(id: string): string {
  return ALL_STRATEGIES.find((s) => s.id === id)?.name || id;
}

// Build smooth stacked-area paths from history
function buildStackedAreas(history: PopEntry[][], strategies: typeof ALL_STRATEGIES) {
  const W = 600;
  const H = 260;
  const PAD_L = 40;
  const PAD_R = 16;
  const PAD_T = 12;
  const PAD_B = 28;
  const chartW = W - PAD_L - PAD_R;
  const chartH = H - PAD_T - PAD_B;
  const maxGen = Math.max(history.length - 1, 1);

  // For each generation, compute cumulative %s per strategy (sorted by final count desc)
  const sortedIds = [...strategies]
    .sort((a, b) => {
      const last = history[history.length - 1];
      const aE = last.find((e) => e.strategyId === a.id);
      const bE = last.find((e) => e.strategyId === b.id);
      return (bE?.count ?? 0) - (aE?.count ?? 0);
    })
    .map((s) => s.id);

  // cumulative stacks[stratIdx][genIdx] = { lo, hi } in pixel-y coords
  type Band = { x: number; lo: number; hi: number }[];
  const bands: { id: string; color: string; points: Band }[] = [];

  for (let si = 0; si < sortedIds.length; si++) {
    const id = sortedIds[si];
    const color = getStrategyColor(id);
    const points: Band = history.map((gen, gi) => {
      const total = gen.reduce((s, e) => s + e.count, 0) || 1;
      // cumulative percent up to and including this strategy
      let cumHi = 0;
      let cumLo = 0;
      for (let j = 0; j <= si; j++) {
        const e = gen.find((g) => g.strategyId === sortedIds[j]);
        cumHi += e ? e.count / total : 0;
      }
      for (let j = 0; j < si; j++) {
        const e = gen.find((g) => g.strategyId === sortedIds[j]);
        cumLo += e ? e.count / total : 0;
      }
      const x = PAD_L + (gi / maxGen) * chartW;
      const yHi = PAD_T + (1 - cumHi) * chartH;
      const yLo = PAD_T + (1 - cumLo) * chartH;
      return { x, lo: yLo, hi: yHi };
    });
    bands.push({ id, color, points });
  }

  return { bands, W, H, PAD_L, PAD_R, PAD_T, PAD_B, chartW, chartH, maxGen };
}

function smoothPath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return '';
  let d = `M${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cx = (prev.x + curr.x) / 2;
    d += ` C${cx},${prev.y} ${cx},${curr.y} ${curr.x},${curr.y}`;
  }
  return d;
}

function EvolutionChart({ history, maxGenerations }: { history: PopEntry[][]; maxGenerations: number }) {
  const { bands, W, H, PAD_L, PAD_T, chartW, chartH, maxGen } = buildStackedAreas(history, ALL_STRATEGIES);

  const genTicks = [0, Math.round(maxGenerations / 4), Math.round(maxGenerations / 2), Math.round((maxGenerations * 3) / 4), maxGenerations];

  return (
    <svg
      className="evolution-chart-svg"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {bands.map(({ id, color }) => (
          <linearGradient key={id} id={`grad-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.95" />
            <stop offset="100%" stopColor={color} stopOpacity="0.7" />
          </linearGradient>
        ))}
      </defs>

      {/* Background */}
      <rect x={PAD_L} y={PAD_T} width={chartW} height={chartH} fill="rgba(255,255,255,0.03)" rx="6" />

      {/* Horizontal grid lines */}
      {[0, 25, 50, 75, 100].map((pct) => {
        const y = PAD_T + (1 - pct / 100) * chartH;
        return (
          <g key={pct}>
            <line x1={PAD_L} y1={y} x2={PAD_L + chartW} y2={y} stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="4 4" />
            <text x={PAD_L - 6} y={y + 4} textAnchor="end" fontSize="9" fill="rgba(255,255,255,0.35)" fontFamily="Nunito,sans-serif">
              {pct}%
            </text>
          </g>
        );
      })}

      {/* Stacked area bands */}
      {bands.map(({ id, color, points }) => {
        const topPts = points.map((p) => ({ x: p.x, y: p.hi }));
        const botPts = [...points].reverse().map((p) => ({ x: p.x, y: p.lo }));
        const topPath = smoothPath(topPts);
        const botPath = smoothPath(botPts);
        const d = topPath + ' ' + botPath.replace('M', 'L') + ' Z';
        return (
          <path key={id} d={d} fill={`url(#grad-${id})`} stroke={color} strokeWidth="1.5" strokeOpacity="0.6" />
        );
      })}

      {/* Current generation marker */}
      {history.length > 1 && (
        <line
          x1={PAD_L + ((history.length - 1) / maxGen) * chartW}
          y1={PAD_T}
          x2={PAD_L + ((history.length - 1) / maxGen) * chartW}
          y2={PAD_T + chartH}
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />
      )}

      {/* X-axis ticks */}
      {genTicks.map((g) => {
        const x = PAD_L + (g / maxGenerations) * chartW;
        const y = PAD_T + chartH;
        return (
          <g key={g}>
            <line x1={x} y1={y} x2={x} y2={y + 4} stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
            <text x={x} y={y + 13} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.4)" fontFamily="Nunito,sans-serif">
              {g}
            </text>
          </g>
        );
      })}

      {/* Axis labels */}
      <text x={PAD_L + chartW / 2} y={H - 2} textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.3)" fontFamily="Nunito,sans-serif">
        Generation
      </text>
    </svg>
  );
}

export default function EvolutionSection({ onComplete }: EvolutionSectionProps) {
  const [phase, setPhase] = useState<'intro' | 'running' | 'done'>('intro');
  const [history, setHistory] = useState<PopEntry[][]>([INITIAL_POP]);
  const [generation, setGeneration] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const maxGenerations = 30;

  const currentPop = history[history.length - 1];
  const totalPop = currentPop.reduce((s, p) => s + p.count, 0);

  const stepGeneration = useCallback(() => {
    setHistory((prev) => {
      const current = prev[prev.length - 1];
      const next = evolvePopulation(current, ALL_STRATEGIES, 10);
      return [...prev, next];
    });
    setGeneration((g) => g + 1);
    playEvolutionTick();
  }, []);

  useEffect(() => {
    if (isAutoPlaying && generation < maxGenerations) {
      intervalRef.current = setInterval(() => {
        setHistory((prev) => {
          const current = prev[prev.length - 1];
          const next = evolvePopulation(current, ALL_STRATEGIES, 10);
          return [...prev, next];
        });
        playEvolutionTick();
        setGeneration((g) => {
          const newG = g + 1;
          if (newG >= maxGenerations) {
            setIsAutoPlaying(false);
            playFanfare();
          }
          return newG;
        });
      }, 300);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAutoPlaying, generation]);

  const startEvolution = () => {
    setPhase('running');
  };

  const resetEvolution = () => {
    setHistory([INITIAL_POP]);
    setGeneration(0);
    setIsAutoPlaying(false);
  };

  return (
    <Section className="evolution-section" dark>
      <div className="evolution-section__content">
        <motion.h2 className="section-title" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Evolution
          {/* <DoodleSquiggles /> */}
        </motion.h2>

        <AnimatePresence mode="wait">
          {phase === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="evolution-section__intro"
            >
              <p className="narrative-text">
                In real life, <strong>successful strategies spread</strong>. People who do well
                get imitated. People who fail disappear.
              </p>
              <p className="narrative-text">
                Let's start with an <strong>equal population</strong> of all strategies and see
                what happens over many generations. Each generation, strategies that score higher
                grow in population, while losers shrink.
              </p>

              <motion.button
                className="btn btn--primary"
                onClick={startEvolution}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Icon icon="noto:dna" width={20} height={20} /> Start Evolution
              </motion.button>
            </motion.div>
          )}

          {(phase === 'running' || phase === 'done') && (
            <motion.div
              key="running"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="evolution-section__sim"
            >
              {/* Gen counter + progress */}
              <div className="evolution-section__gen-header">
                <span className="evolution-section__gen-label">
                  Generation <strong>{generation}</strong> / {maxGenerations}
                </span>
                <div className="evolution-section__progress-track">
                  <motion.div
                    className="evolution-section__progress-fill"
                    animate={{ width: `${(generation / maxGenerations) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Stacked area chart */}
              {/* <div className="evolution-section__chart"> */}
                <EvolutionChart history={history} maxGenerations={maxGenerations} />
              {/* </div> */}

              {/* Legend — compact pill grid */}
              <div className="evolution-section__legend">
                {[...currentPop]
                  .sort((a, b) => b.count - a.count)
                  .map((p) => (
                    <div
                      key={p.strategyId}
                      className={`evolution-section__legend-item ${p.count === 0 ? 'evolution-section__legend-item--dead' : ''}`}
                    >
                      <span
                        className="evolution-section__legend-dot"
                        style={{ background: getStrategyColor(p.strategyId) }}
                      />
                      <span
                        className="evolution-section__legend-icon"
                        style={{ color: p.count > 0 ? getStrategyColor(p.strategyId) : '#666' }}
                      >
                        {getStrategyIcon(p.strategyId, 14)}
                      </span>
                      <span
                        className="evolution-section__legend-name"
                        style={{ color: p.count > 0 ? getStrategyColor(p.strategyId) : undefined }}
                      >
                        {getStrategyName(p.strategyId)}
                      </span>
                      <span className="evolution-section__legend-pct">
                        {Math.round((p.count / totalPop) * 100)}%
                      </span>
                    </div>
                  ))}
              </div>

              {/* Controls */}
              <div className="evolution-section__controls">
                <motion.button
                  className="btn btn--secondary"
                  onClick={stepGeneration}
                  disabled={isAutoPlaying || generation >= maxGenerations}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  +1 Step
                </motion.button>
                <motion.button
                  className="btn btn--primary"
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  disabled={generation >= maxGenerations}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {isAutoPlaying ? <><Icon icon="noto:pause-button" width={18} height={18} /> Pause</> : <><Icon icon="noto:play-button" width={18} height={18} /> Auto Play</>}
                </motion.button>
                <motion.button
                  className="btn btn--ghost"
                  onClick={resetEvolution}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Icon icon="noto:counterclockwise-arrows-button" width={18} height={18} /> Reset
                </motion.button>
              </div>

              {generation >= maxGenerations && (
                <motion.div
                  className="evolution-section__conclusion"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="narrative-text">
                    Over time, the population converges. Strategies that can cooperate with each
                    other while protecting themselves from exploiters tend to <strong>thrive</strong>.
                  </p>
                  <p className="narrative-text">
                    This is the core insight: <strong>trust evolves</strong> — not through
                    blind optimism, but through repeated interactions, retaliation against
                    cheaters, and forgiveness for mistakes.
                  </p>
                  <motion.button
                    className="btn btn--primary"
                    onClick={onComplete}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    The Takeaways →
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
