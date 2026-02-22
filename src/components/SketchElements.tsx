import { motion, AnimatePresence } from 'framer-motion';
import './SketchElements.css';

/* ============================
   SVG Filter Definitions
   Include once at app root
   ============================ */
export function SketchFilters() {
  return (
    <svg className="sketch-filters" aria-hidden="true">
      <defs>
        <filter id="sketchy" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="3" result="noise" seed="2" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" />
        </filter>
        <filter id="pencil" x="-2%" y="-2%" width="104%" height="104%">
          <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="5" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1" />
        </filter>
      </defs>
    </svg>
  );
}

/* ============================
   Trust Machine SVG
   ============================ */
export function MachineSVG({ className, playerChoice, opponentChoice }: { className?: string; playerChoice?: 'cooperate' | 'cheat' | null; opponentChoice?: 'cooperate' | 'cheat' | null }) {
  return (
    <svg className={`machine-svg ${className ?? ''}`} viewBox="0 0 200 150" fill="none" filter="url(#sketchy)">
      {/* Side tabs */}
      <rect x="15" y="60" width="10" height="30" fill="#e0e0e0" stroke="#555" strokeWidth="2" />
      <rect x="175" y="60" width="10" height="30" fill="#e0e0e0" stroke="#555" strokeWidth="2" />
      
      {/* Machine body */}
      <rect x="20" y="30" width="160" height="90" rx="12" fill="#ffffff" stroke="#555" strokeWidth="3" />
      
      {/* Top tab */}
      <path d="M60 30 v-8 a6 6 0 0 1 6 -6 h68 a6 6 0 0 1 6 6 v8 z" fill="#5b8bce" stroke="#555" strokeWidth="2" />
      <text x="100" y="24" textAnchor="middle" fontSize="6" fontFamily="sans-serif" fill="#fff" fontWeight="bold" letterSpacing="0.5">THE TRUST MACHINE</text>
      
      {/* Top little handle */}
      <rect x="85" y="10" width="30" height="6" rx="3" fill="#fff" stroke="#555" strokeWidth="2" />
      
      {/* Dashed inner screen */}
      <rect x="35" y="45" width="130" height="40" rx="8" fill="#f4f4f4" stroke="#555" strokeWidth="2" strokeDasharray="6 4" />
      
      {/* Dotted circles */}
      <circle cx="70" cy="65" r="12" fill="none" stroke="#ccc" strokeWidth="2" strokeDasharray="4 4" />
      <circle cx="130" cy="65" r="12" fill="none" stroke="#ccc" strokeWidth="2" strokeDasharray="4 4" />
      <text x="100" y="70" textAnchor="middle" fontSize="14" fontFamily="sans-serif" fill="#aaa" fontWeight="bold">× 2</text>
      
      {/* Animated Choice inside the left circle */}
      <AnimatePresence>
        {playerChoice === 'cooperate' && (
          <motion.g
            key="cooperate"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <circle cx="70" cy="65" r="10" fill="#ffd700" stroke="#d4ac0d" strokeWidth="1.5" />
            <circle cx="70" cy="65" r="4" fill="#d4ac0d" />
            <circle cx="70" cy="65" r="2" fill="#ffd700" />
          </motion.g>
        )}
        {playerChoice === 'cheat' && (
          <motion.g
            key="cheat"
            initial={{ opacity: 0, scale: 0, rotate: -45 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0, rotate: 45 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <line x1="63" y1="58" x2="77" y2="72" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="77" y1="58" x2="63" y2="72" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" />
          </motion.g>
        )}
      </AnimatePresence>

      {/* Animated Choice inside the right circle (Opponent) */}
      <AnimatePresence>
        {opponentChoice === 'cooperate' && (
          <motion.g
            key="opp-cooperate"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
          >
            <circle cx="130" cy="65" r="10" fill="#ffd700" stroke="#d4ac0d" strokeWidth="1.5" />
            <circle cx="130" cy="65" r="4" fill="#d4ac0d" />
            <circle cx="130" cy="65" r="2" fill="#ffd700" />
          </motion.g>
        )}
        {opponentChoice === 'cheat' && (
          <motion.g
            key="opp-cheat"
            initial={{ opacity: 0, scale: 0, rotate: 45 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0, rotate: -45 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
          >
            <line x1="123" y1="58" x2="137" y2="72" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="137" y1="58" x2="123" y2="72" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" />
          </motion.g>
        )}
      </AnimatePresence>

      {/* Payout slot */}
      <rect x="50" y="95" width="100" height="25" rx="6" fill="#fff" stroke="#555" strokeWidth="2" />
      <rect x="55" y="100" width="90" height="15" rx="4" fill="#f4f4f4" stroke="#ccc" strokeWidth="1.5" />
      <text x="100" y="111" textAnchor="middle" fontSize="10" fontFamily="sans-serif" fill="#aaa" fontWeight="bold" letterSpacing="1">PAYOUT</text>
      
      {/* Corner screws */}
      <circle cx="30" cy="40" r="2.5" fill="#ccc" />
      <circle cx="170" cy="40" r="2.5" fill="#ccc" />
      <circle cx="30" cy="110" r="2.5" fill="#ccc" />
      <circle cx="170" cy="110" r="2.5" fill="#ccc" />
    </svg>
  );
}

/* ============================
   Trophy SVG
   ============================ */
export function TrophySVG({ size = 48, className }: { size?: number; className?: string }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path d="M14 8h20v14c0 6-4.5 10-10 10s-10-4-10-10V8z" fill="#fbbf24" stroke="#b45309" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M14 12H8c0 6 3 9 6 10" stroke="#b45309" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M34 12h6c0 6-3 9-6 10" stroke="#b45309" strokeWidth="2" strokeLinecap="round" fill="none" />
      <rect x="20" y="32" width="8" height="6" rx="1" fill="#d97706" />
      <rect x="16" y="38" width="16" height="4" rx="2" fill="#d97706" />
      <path d="M24 13l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4z" fill="#fff" opacity="0.5" />
    </svg>
  );
}

/* ============================
   Animated Score Popup
   ============================ */
export function ScorePopup({ score, id }: { score: number; id: string | number }) {
  return (
    <motion.span
      key={id}
      className="score-popup"
      style={{
        color: score > 0 ? 'var(--neon-green)' : score < 0 ? 'var(--neon-red)' : 'var(--text-muted)',
      }}
      initial={{ opacity: 1, y: 0, scale: 0.5 }}
      animate={{ opacity: 0, y: -50, scale: 1.8 }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
    >
      {score >= 0 ? '+' : ''}{score}
    </motion.span>
  );
}

/* ============================
   Doodle Decorations
   ============================ */
export function DoodleStars({ className }: { className?: string }) {
  return (
    <svg className={`doodle-decoration ${className ?? ''}`} viewBox="0 0 300 80" fill="none" preserveAspectRatio="xMidYMid meet">
      <path d="M30 40l3 6h7l-5 4 2 7-7-4-7 4 2-7-5-4h7z" stroke="var(--neon-yellow)" strokeWidth="1.5" fill="var(--neon-yellow)" opacity="0.25" strokeLinejoin="round" />
      <path d="M270 30l2 4h5l-4 3 1.5 5-4.5-3-4.5 3 1.5-5-4-3h5z" stroke="var(--neon-yellow)" strokeWidth="1.2" fill="var(--neon-yellow)" opacity="0.2" strokeLinejoin="round" />
      <path d="M150 15l1.5 3h3.5l-3 2 1 3.5-3-2-3 2 1-3.5-3-2h3.5z" stroke="var(--neon-purple)" strokeWidth="1" fill="var(--neon-purple)" opacity="0.2" strokeLinejoin="round" />
      <path d="M80 60l2 4h4l-3 3 1 4-4-2.5-4 2.5 1-4-3-3h4z" stroke="var(--neon-blue)" strokeWidth="1" fill="var(--neon-blue)" opacity="0.15" strokeLinejoin="round" />
      <path d="M220 55l1.5 3h3l-2.5 2 1 3-3-2-3 2 1-3-2.5-2h3z" stroke="var(--neon-pink)" strokeWidth="1" fill="var(--neon-pink)" opacity="0.2" strokeLinejoin="round" />
    </svg>
  );
}

export function DoodleSquiggles({ className }: { className?: string }) {
  return (
    <svg className={`doodle-decoration ${className ?? ''}`} viewBox="0 0 300 40" fill="none" preserveAspectRatio="xMidYMid meet">
      <path d="M10 20Q30 5 50 20Q70 35 90 20Q110 5 130 20" stroke="var(--neon-blue)" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
      <path d="M170 20Q190 35 210 20Q230 5 250 20Q270 35 290 20" stroke="var(--neon-purple)" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
    </svg>
  );
}

/* ============================
   Sketch Underline
   ============================ */
export function SketchUnderline({ width = 120, color = 'var(--neon-blue)', className }: { width?: number; color?: string; className?: string }) {
  return (
    <svg className={className} width={width} height="8" viewBox="0 0 120 8" fill="none" style={{ display: 'block', margin: '0 auto' }}>
      <path d="M2 4Q14 1 26 4Q38 7 50 4Q62 1 74 4Q86 7 98 4Q110 1 118 4" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

/* ============================
   Bouncing Arrow
   ============================ */
export function BouncingArrow({ direction = 'down', className, color }: { direction?: 'down' | 'right'; className?: string; color?: string }) {
  const rotate = direction === 'right' ? -90 : 0;
  return (
    <motion.svg
      className={className}
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      style={{ transform: `rotate(${rotate}deg)` }}
      animate={{ y: [0, 6, 0] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    >
      <path d="M12 4v14M6 14l6 6 6-6" stroke={color ?? 'currentColor'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </motion.svg>
  );
}

/* ============================
   Confetti Burst
   ============================ */
export function ConfettiBurst({ active }: { active: boolean }) {
  if (!active) return null;
  const particles = Array.from({ length: 16 }).map((_, i) => ({
    angle: (i / 16) * 360,
    color: ['var(--neon-blue)', 'var(--neon-yellow)', 'var(--neon-green)', 'var(--neon-pink)', 'var(--neon-purple)', 'var(--neon-orange)'][i % 6],
    delay: Math.random() * 0.2,
    distance: 40 + Math.random() * 60,
    size: 4 + Math.random() * 6,
  }));
  return (
    <div className="confetti-burst">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="confetti-particle"
          style={{
            background: p.color,
            width: p.size,
            height: p.size,
            borderRadius: i % 3 === 0 ? '50%' : '2px',
          }}
          initial={{ x: 0, y: 0, scale: 1, opacity: 1, rotate: 0 }}
          animate={{
            x: Math.cos((p.angle * Math.PI) / 180) * p.distance,
            y: Math.sin((p.angle * Math.PI) / 180) * p.distance,
            scale: 0,
            opacity: 0,
            rotate: 360,
          }}
          transition={{ duration: 0.9, delay: p.delay, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}

/* ============================
   Notebook Page Decoration
   (corner fold, tape, etc.)
   ============================ */
export function NotebookCorner({ className, position = 'top-right' }: { className?: string; position?: 'top-right' | 'top-left' }) {
  const flip = position === 'top-left' ? 'scaleX(-1)' : 'none';
  return (
    <svg className={className} width="40" height="40" viewBox="0 0 40 40" fill="none" style={{ transform: flip }}>
      <path d="M40 0L40 40L0 40" fill="var(--bg-dark)" stroke="var(--sketch-border)" strokeWidth="1.5" />
      <path d="M40 0L0 40" stroke="var(--sketch-border)" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
    </svg>
  );
}

/* ============================
   Tape Strip (decorative)
   ============================ */
export function TapeStrip({ className, color = 'var(--neon-yellow)', rotation = -3 }: { className?: string; color?: string; rotation?: number }) {
  return (
    <svg
      className={className}
      width="80"
      height="24"
      viewBox="0 0 80 24"
      fill="none"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <rect x="0" y="4" width="80" height="16" rx="2" fill={color} opacity="0.25" />
      <rect x="0" y="4" width="80" height="16" rx="2" fill="none" stroke={color} strokeWidth="1" opacity="0.4" />
    </svg>
  );
}

/* ============================
   SVG Game Badge
   ============================ */
export function GameBadge({ label, color = 'var(--neon-blue)', className }: { label: string; color?: string; className?: string }) {
  return (
    <div className={`game-badge ${className ?? ''}`} style={{ '--badge-color': color } as React.CSSProperties}>
      <svg width="100%" height="100%" viewBox="0 0 120 36" fill="none" preserveAspectRatio="none">
        <rect x="2" y="2" width="116" height="32" rx="16" fill={color} opacity="0.12" stroke={color} strokeWidth="2" strokeDasharray="6 3" />
      </svg>
      <span className="game-badge__label">{label}</span>
    </div>
  );
}
