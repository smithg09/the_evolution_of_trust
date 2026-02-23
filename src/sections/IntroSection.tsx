
import { motion } from 'framer-motion';
import Section from '../components/Section';
import { DoodleStars, DoodleSquiggles, BouncingArrow } from '../components/SketchElements';
import { playGameStart } from '../engine/sounds';
import './IntroSection.css';

/* Small inline SVG doodles for scattering */
const DoodleCircle = ({ size = 32, color = 'var(--neon-blue)', style }: { size?: number; color?: string; style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={style} className="intro-doodle-shape">
    <circle cx="16" cy="16" r="13" stroke={color} strokeWidth="2.5" strokeDasharray="4 3" fill="none" />
    <circle cx="16" cy="16" r="5" fill={color} opacity="0.2" />
  </svg>
);

const DoodleDiamond = ({ size = 28, color = 'var(--neon-purple)', style }: { size?: number; color?: string; style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none" style={style} className="intro-doodle-shape">
    <rect x="14" y="2" width="16" height="16" rx="2" transform="rotate(45 14 2)" stroke={color} strokeWidth="2.5" fill={color} fillOpacity="0.1" />
  </svg>
);

const DoodlePlus = ({ size = 24, color = 'var(--neon-yellow)', style }: { size?: number; color?: string; style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} className="intro-doodle-shape">
    <line x1="12" y1="4" x2="12" y2="20" stroke={color} strokeWidth="3" strokeLinecap="round" />
    <line x1="4" y1="12" x2="20" y2="12" stroke={color} strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const DoodleZigzag = ({ size = 44, color = 'var(--neon-orange)', style }: { size?: number; color?: string; style?: React.CSSProperties }) => (
  <svg width={size} height={Math.round(size * 0.4)} viewBox="0 0 44 18" fill="none" style={style} className="intro-doodle-shape">
    <polyline points="2,14 11,4 20,14 29,4 38,14" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const DoodleSpiral = ({ size = 34, color = 'var(--neon-blue)', style }: { size?: number; color?: string; style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 34 34" fill="none" style={style} className="intro-doodle-shape">
    <path d="M17 17C17 14.5 15 13 13 13C10 13 8 15.5 8 18C8 22 11 25 15 25C20.5 25 24 21 24 16C24 9.5 19 5 13 5" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
);

const DoodleTriangle = ({ size = 28, color = 'var(--neon-green, #6fcf97)', style }: { size?: number; color?: string; style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none" style={style} className="intro-doodle-shape">
    <polygon points="14,3 26,25 2,25" stroke={color} strokeWidth="2.5" strokeLinejoin="round" fill={color} fillOpacity="0.08" />
  </svg>
);

interface IntroSectionProps {
  onStart: () => void;
}

export default function IntroSection({ onStart }: IntroSectionProps) {
  return (
    <Section className="intro-section">
      <motion.div
        className="intro-section__content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Decorative doodles */}
        <DoodleStars className="intro-section__doodle-top" />

        <div className="intro-section__badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
            <path d="M12 2L14.5 9H22L16 13.5L18 21L12 16.5L6 21L8 13.5L2 9H9.5L12 2Z" stroke="var(--neon-purple)" strokeWidth="2" fill="var(--neon-purple)" opacity="0.3" strokeLinejoin="round" />
          </svg>
          A GAME THEORY EXPERIMENT
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
            <path d="M12 2L14.5 9H22L16 13.5L18 21L12 16.5L6 21L8 13.5L2 9H9.5L12 2Z" stroke="var(--neon-purple)" strokeWidth="2" fill="var(--neon-purple)" opacity="0.3" strokeLinejoin="round" />
          </svg>
        </div>

        <h1 className="intro-section__title">
          <span className="intro-section__title-the">THE</span>
          <span className="intro-section__title-main">EVOLUTION</span>
          <span className="intro-section__title-of">OF TRUST</span>
        </h1>

        {/* Hand-drawn underline SVG */}
        <svg className="intro-section__title-underline" width="280" height="10" viewBox="0 0 280 10" fill="none">
          <path d="M4 5Q25 2 50 5Q75 8 100 5Q125 2 150 5Q175 8 200 5Q225 2 250 5Q265 7 276 5" stroke="var(--neon-blue)" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
        </svg>

        <p className="intro-section__subtitle">
          Explore how cooperation emerges, survives, and breaks down through the lens of the <em>Prisoner's Dilemma</em>
        </p>

        <p className="intro-section__credit">
          Inspired by{' '}
          <a href="https://www.youtube.com/watch?v=mScpHTIi-kM" target="_blank" rel="noopener noreferrer">
            Veritasium's game theory deep-dive
          </a>
          <br />
          Based on{' '}
          <a href="https://archive.org/details/evolutionofcoop00axel/mode/2up" target="_blank" rel="noopener noreferrer">
            Axelrod's <em>The Evolution of Cooperation</em>
          </a>
        </p>

        {/* Doodle squiggles decoration */}
        <DoodleSquiggles className="intro-section__doodle-mid" />

        <motion.button
          className="intro-section__play-btn"
          onClick={() => { playGameStart(); onStart(); }}
          whileHover={{ scale: 1.06, rotate: -1 }}
          whileTap={{ scale: 0.95, rotate: 0 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <polygon points="6,3 20,12 6,21" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
          <span>PLAY</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          style={{ marginTop: '1.5rem' }}
        >
          <BouncingArrow direction="down" color="var(--text-muted)" />
        </motion.div>

        {/* Floating sketch particles */}
        <div className="intro-section__particles">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="intro-section__particle"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
              }}
              animate={{
                opacity: [0, 0.4, 0],
                scale: [0, 1, 0],
                rotate: [0, 180],
              }}
              transition={{
                duration: 3 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 4,
              }}
            />
          ))}
        </div>

        {/* Scattered SVG doodle shapes — popping in/out */}
        <div className="intro-section__doodle-shapes" aria-hidden="true">
          {/* Top-left cluster */}
          <motion.div className="intro-doodle-float" style={{ top: '8%', left: '5%' }}
            animate={{ opacity: [0, 0.7, 0], scale: [0.3, 1, 0.3], rotate: [0, 15, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: 0.2 }}>
            <DoodleCircle size={36} color="var(--neon-blue)" />
          </motion.div>

          <motion.div className="intro-doodle-float" style={{ top: '15%', left: '12%' }}
            animate={{ opacity: [0, 0.5, 0], scale: [0.5, 1.1, 0.5], y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, delay: 1.5 }}>
            <DoodlePlus size={20} color="var(--neon-yellow)" />
          </motion.div>

          {/* Top-right cluster */}
          <motion.div className="intro-doodle-float" style={{ top: '6%', right: '8%' }}
            animate={{ opacity: [0, 0.6, 0], scale: [0.4, 1, 0.4], rotate: [0, 90, 180] }}
            transition={{ duration: 4.5, repeat: Infinity, delay: 0.8 }}>
            <DoodleDiamond size={30} color="var(--neon-purple)" />
          </motion.div>

          <motion.div className="intro-doodle-float" style={{ top: '18%', right: '4%' }}
            animate={{ opacity: [0, 0.5, 0], scale: [0.6, 1, 0.6] }}
            transition={{ duration: 3.5, repeat: Infinity, delay: 2.2 }}>
            <DoodleTriangle size={24} color="var(--neon-green, #6fcf97)" />
          </motion.div>

          {/* Middle-left */}
          <motion.div className="intro-doodle-float" style={{ top: '40%', left: '3%' }}
            animate={{ opacity: [0, 0.55, 0], x: [0, 5, 0], rotate: [0, -10, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, delay: 0.5 }}>
            <DoodleZigzag size={48} color="var(--neon-orange)" />
          </motion.div>

          <motion.div className="intro-doodle-float" style={{ top: '55%', left: '7%' }}
            animate={{ opacity: [0, 0.6, 0], scale: [0.3, 1.1, 0.3], rotate: [0, 360] }}
            transition={{ duration: 6, repeat: Infinity, delay: 1.0 }}>
            <DoodleSpiral size={30} color="var(--neon-blue)" />
          </motion.div>

          {/* Middle-right */}
          <motion.div className="intro-doodle-float" style={{ top: '45%', right: '5%' }}
            animate={{ opacity: [0, 0.5, 0], scale: [0.5, 1, 0.5], y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: 3.0 }}>
            <DoodleCircle size={24} color="var(--neon-purple)" />
          </motion.div>

          <motion.div className="intro-doodle-float" style={{ top: '35%', right: '10%' }}
            animate={{ opacity: [0, 0.45, 0], scale: [0.4, 1, 0.4], rotate: [0, 45, 0] }}
            transition={{ duration: 5, repeat: Infinity, delay: 1.8 }}>
            <DoodlePlus size={26} color="var(--neon-yellow)" />
          </motion.div>

          {/* Bottom-left */}
          <motion.div className="intro-doodle-float" style={{ bottom: '15%', left: '6%' }}
            animate={{ opacity: [0, 0.6, 0], scale: [0.3, 1, 0.3], rotate: [0, -90, -180] }}
            transition={{ duration: 4.2, repeat: Infinity, delay: 2.5 }}>
            <DoodleDiamond size={22} color="var(--neon-blue)" />
          </motion.div>

          <motion.div className="intro-doodle-float" style={{ bottom: '20%', left: '15%' }}
            animate={{ opacity: [0, 0.4, 0], y: [0, -6, 0] }}
            transition={{ duration: 3.8, repeat: Infinity, delay: 0.3 }}>
            <DoodleTriangle size={20} color="var(--neon-orange)" />
          </motion.div>

          {/* Bottom-right */}
          <motion.div className="intro-doodle-float" style={{ bottom: '12%', right: '8%' }}
            animate={{ opacity: [0, 0.55, 0], scale: [0.5, 1.1, 0.5], rotate: [0, 180] }}
            transition={{ duration: 5.2, repeat: Infinity, delay: 1.2 }}>
            <DoodleSpiral size={36} color="var(--neon-purple)" />
          </motion.div>

          <motion.div className="intro-doodle-float" style={{ bottom: '8%', right: '18%' }}
            animate={{ opacity: [0, 0.5, 0], scale: [0.6, 1, 0.6], rotate: [0, 30, 0] }}
            transition={{ duration: 4.8, repeat: Infinity, delay: 3.5 }}>
            <DoodleZigzag size={38} color="var(--neon-yellow)" />
          </motion.div>

          {/* Extra scattered small shapes */}
          <motion.div className="intro-doodle-float" style={{ top: '70%', left: '30%' }}
            animate={{ opacity: [0, 0.4, 0], scale: [0, 1, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: 2.0 }}>
            <DoodlePlus size={16} color="var(--neon-blue)" />
          </motion.div>

          <motion.div className="intro-doodle-float" style={{ top: '25%', left: '25%' }}
            animate={{ opacity: [0, 0.35, 0], scale: [0.3, 1, 0.3], rotate: [0, 120, 240] }}
            transition={{ duration: 6.5, repeat: Infinity, delay: 4.0 }}>
            <DoodleCircle size={18} color="var(--neon-orange)" />
          </motion.div>

          <motion.div className="intro-doodle-float" style={{ top: '60%', right: '25%' }}
            animate={{ opacity: [0, 0.4, 0], scale: [0.5, 1, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, delay: 2.8 }}>
            <DoodleTriangle size={18} color="var(--neon-purple)" />
          </motion.div>
        </div>
      </motion.div>
    </Section>
  );
}
