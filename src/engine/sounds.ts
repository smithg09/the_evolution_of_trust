/**
 * 🔊 Sound Effects Engine
 *
 * Synthesized audio using the Web Audio API — no external files needed.
 * Each effect is a tiny function that creates & plays oscillator / noise bursts.
 */

let _ctx: AudioContext | null = null;
let _muted = false;

function ctx(): AudioContext {
  if (!_ctx) _ctx = new AudioContext();
  return _ctx;
}

/** Resume the AudioContext after a user gesture (required by browsers). */
function ensureResumed() {
  const c = ctx();
  if (c.state === 'suspended') c.resume();
}

/* ── public API ──────────────────────────────────────────── */

export function isMuted(): boolean {
  return _muted;
}

export function setMuted(muted: boolean) {
  _muted = muted;
}

export function toggleMute(): boolean {
  _muted = !_muted;
  return _muted;
}

/* ── helpers ─────────────────────────────────────────────── */

function gain(value: number, rampEnd?: number): GainNode {
  const g = ctx().createGain();
  g.gain.setValueAtTime(value, ctx().currentTime);
  if (rampEnd !== undefined) {
    g.gain.linearRampToValueAtTime(0, ctx().currentTime + rampEnd);
  }
  return g;
}

function osc(type: OscillatorType, freq: number, duration: number, vol = 0.15): OscillatorNode {
  const o = ctx().createOscillator();
  o.type = type;
  o.frequency.setValueAtTime(freq, ctx().currentTime);
  const g = gain(vol, duration);
  o.connect(g).connect(ctx().destination);
  o.start();
  o.stop(ctx().currentTime + duration);
  return o;
}

/**
 * Play a sequence of notes with a given gap between them.
 */
function melody(
  notes: { freq: number; dur: number; type?: OscillatorType }[],
  gap: number,
  vol = 0.12,
) {
  let t = ctx().currentTime;
  for (const n of notes) {
    const o = ctx().createOscillator();
    o.type = n.type ?? 'sine';
    o.frequency.setValueAtTime(n.freq, t);
    const g = ctx().createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.linearRampToValueAtTime(0, t + n.dur);
    o.connect(g).connect(ctx().destination);
    o.start(t);
    o.stop(t + n.dur);
    t += n.dur + gap;
  }
}

/* ── Sound effects ───────────────────────────────────────── */

/** Cheerful coin-drop / ding when cooperating */
export function playCoinCooperate() {
  if (_muted) return;
  ensureResumed();
  melody(
    [
      { freq: 587, dur: 0.08, type: 'triangle' },
      { freq: 784, dur: 0.08, type: 'triangle' },
      { freq: 1047, dur: 0.15, type: 'sine' },
    ],
    0.04,
    0.13,
  );
}

/** Short sneaky "boop" when cheating */
export function playCheat() {
  if (_muted) return;
  ensureResumed();
  melody(
    [
      { freq: 440, dur: 0.06, type: 'square' },
      { freq: 330, dur: 0.12, type: 'square' },
    ],
    0.03,
    0.08,
  );
}

/** Positive result jingle (you scored well) */
export function playWin() {
  if (_muted) return;
  ensureResumed();
  melody(
    [
      { freq: 523, dur: 0.1, type: 'sine' },
      { freq: 659, dur: 0.1, type: 'sine' },
      { freq: 784, dur: 0.2, type: 'sine' },
    ],
    0.05,
    0.1,
  );
}

/** Negative result buzz (you got cheated) */
export function playLose() {
  if (_muted) return;
  ensureResumed();
  osc('sawtooth', 180, 0.25, 0.07);
  setTimeout(() => osc('sawtooth', 150, 0.3, 0.06), 100);
}

/** Subtle UI click / tap */
export function playClick() {
  if (_muted) return;
  ensureResumed();
  osc('sine', 660, 0.06, 0.08);
}

/** Section unlock whoosh */
export function playSectionUnlock() {
  if (_muted) return;
  ensureResumed();
  const c = ctx();
  const t = c.currentTime;
  const o = c.createOscillator();
  o.type = 'sine';
  o.frequency.setValueAtTime(400, t);
  o.frequency.exponentialRampToValueAtTime(1200, t + 0.25);
  const g = c.createGain();
  g.gain.setValueAtTime(0.1, t);
  g.gain.linearRampToValueAtTime(0, t + 0.35);
  o.connect(g).connect(c.destination);
  o.start(t);
  o.stop(t + 0.35);
}

/** Tournament start — dramatic rising sweep */
export function playTournamentStart() {
  if (_muted) return;
  ensureResumed();
  const c = ctx();
  const t = c.currentTime;
  // Sweep
  const o = c.createOscillator();
  o.type = 'triangle';
  o.frequency.setValueAtTime(200, t);
  o.frequency.exponentialRampToValueAtTime(800, t + 0.4);
  const g = c.createGain();
  g.gain.setValueAtTime(0.1, t);
  g.gain.linearRampToValueAtTime(0, t + 0.5);
  o.connect(g).connect(c.destination);
  o.start(t);
  o.stop(t + 0.5);
  // Stinger
  setTimeout(
    () =>
      melody(
        [
          { freq: 523, dur: 0.08, type: 'triangle' },
          { freq: 659, dur: 0.08, type: 'triangle' },
          { freq: 784, dur: 0.18, type: 'triangle' },
        ],
        0.04,
        0.12,
      ),
    300,
  );
}

/** Fanfare for tournament / evolution results */
export function playFanfare() {
  if (_muted) return;
  ensureResumed();
  melody(
    [
      { freq: 523, dur: 0.12, type: 'triangle' },
      { freq: 523, dur: 0.12, type: 'triangle' },
      { freq: 523, dur: 0.12, type: 'triangle' },
      { freq: 659, dur: 0.25, type: 'triangle' },
      { freq: 587, dur: 0.12, type: 'triangle' },
      { freq: 659, dur: 0.35, type: 'triangle' },
    ],
    0.06,
    0.12,
  );
}

/** Subtle tick for evolution generations */
export function playEvolutionTick() {
  if (_muted) return;
  ensureResumed();
  osc('sine', 880 + Math.random() * 200, 0.04, 0.04);
}

/** Play button press — game start */
export function playGameStart() {
  if (_muted) return;
  ensureResumed();
  melody(
    [
      { freq: 392, dur: 0.1, type: 'square' },
      { freq: 523, dur: 0.1, type: 'square' },
      { freq: 659, dur: 0.1, type: 'square' },
      { freq: 784, dur: 0.25, type: 'sine' },
    ],
    0.06,
    0.1,
  );
}

/** Narrative step advance — gentle blip */
export function playStepAdvance() {
  if (_muted) return;
  ensureResumed();
  osc('sine', 520, 0.07, 0.07);
  setTimeout(() => osc('sine', 620, 0.06, 0.05), 60);
}

/** Match complete chime */
export function playMatchComplete() {
  if (_muted) return;
  ensureResumed();
  melody(
    [
      { freq: 659, dur: 0.1, type: 'sine' },
      { freq: 784, dur: 0.1, type: 'sine' },
      { freq: 1047, dur: 0.3, type: 'sine' },
    ],
    0.06,
    0.11,
  );
}
