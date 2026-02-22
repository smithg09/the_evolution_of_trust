import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Section from '../components/Section';
import PayoffMatrix from '../components/PayoffMatrix';
import CoinSlot from '../components/CoinSlot';
import type { Move } from '../engine';
import { getPayoff } from '../engine';
import { playStepAdvance, playWin, playLose } from '../engine/sounds';
import './WhatIsTheGameSection.css';

interface WhatIsTheGameSectionProps {
  onComplete: () => void;
}

export default function WhatIsTheGameSection({ onComplete }: WhatIsTheGameSectionProps) {
  const [step, setStep] = useState(0);
  const [demoResult, setDemoResult] = useState<{
    yourMove: Move;
    theirMove: Move;
    yourScore: number;
    theirScore: number;
  } | null>(null);
  const [highlightCell, setHighlightCell] = useState<[number, number] | null>(null);
  const [demoCount, setDemoCount] = useState(0);

  const handleDemoChoice = (move: Move) => {
    // Opponent always cooperates in this tutorial
    const theirMove: Move = 'cooperate';
    const yourScore = getPayoff(move, theirMove);
    const theirScore = getPayoff(theirMove, move);
    setDemoResult({ yourMove: move, theirMove, yourScore, theirScore });
    setHighlightCell(move === 'cooperate' ? [0, 0] : [1, 0]);
    setDemoCount((c) => c + 1);
    // Sound feedback based on outcome
    if (move === 'cooperate') playWin(); else playLose();
  };

  const narrativeSteps = [
    {
      text: "Here's the game. It's called **The Trust Game**. You have a partner — someone you've never met.",
      action: () => { playStepAdvance(); setStep(1); },
    },
    {
      text: "Each round, you both choose simultaneously: put a coin in the machine, or keep your coin.",
      action: () => { playStepAdvance(); setStep(2); },
    },
    {
      text: "If you **both** put a coin in, the machine gives you each **+3 coins**. Win-win!",
      action: () => {
        playStepAdvance();
        setHighlightCell([0, 0]);
        setStep(3);
      },
    },
    {
      text: "If **only one** of you puts in a coin, the cheater gets **+5** while the cooperator gets **0**.",
      action: () => {
        playStepAdvance();
        setHighlightCell([1, 0]);
        setStep(4);
      },
    },
    {
      text: "If **neither** of you puts in a coin... you both get **+1**.",
      action: () => {
        playStepAdvance();
        setHighlightCell([1, 1]);
        setStep(5);
      },
    },
    {
      text: "**Try it out!** Your partner will cooperate. What will you do?",
      action: null,
    },
  ];

  return (
    <Section className="what-is-section" dark>
      <div className="what-is-section__content">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          The Trust Game
        </motion.h2>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            className="what-is-section__narrative"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
          >
            <p
              className="narrative-text"
              dangerouslySetInnerHTML={{
                __html: narrativeSteps[step].text.replace(
                  /\*\*(.*?)\*\*/g,
                  '<strong>$1</strong>'
                ),
              }}
            />
          </motion.div>
        </AnimatePresence>

        {step >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <PayoffMatrix highlightCell={highlightCell} />
          </motion.div>
        )}

        {(step === 5 && !demoResult) && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <CoinSlot onChoice={handleDemoChoice} size="large" disabled={!!demoResult} showMachine={false}  />
          </motion.div>
        )}

        {demoResult && (
          <motion.div
            className="what-is-section__result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="what-is-section__result-grid">
              <div className="result-card">
                <span className="result-card__label">You</span>
                <span className="result-card__move">
                  {demoResult.yourMove === 'cooperate' ? 'Cooperated' : 'Cheated'}
                </span>
                <span
                  className="result-card__score"
                  style={{
                    color:
                      demoResult.yourScore > 0 ? 'var(--neon-green)' : demoResult.yourScore < 0 ? 'var(--neon-red)' : 'var(--text-secondary)',
                  }}
                >
                  {demoResult.yourScore >= 0 ? '+' : ''}
                  {demoResult.yourScore}
                </span>
              </div>
              <div className="result-card">
                <span className="result-card__label">Partner</span>
                <span className="result-card__move">Cooperated</span>
                <span
                  className="result-card__score"
                  style={{
                    color:
                      demoResult.theirScore > 0 ? 'var(--neon-green)' : demoResult.theirScore < 0 ? 'var(--neon-red)' : 'var(--text-secondary)',
                  }}
                >
                  {demoResult.theirScore >= 0 ? '+' : ''}
                  {demoResult.theirScore}
                </span>
              </div>
            </div>

            {demoCount < 3 ? (
              <motion.button
                className="btn btn--secondary"
                onClick={() => setDemoResult(null)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Try again ({3 - demoCount} more)
              </motion.button>
            ) : (
              <motion.button
                className="btn btn--primary"
                onClick={onComplete}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                But what happens when you play <em>multiple</em> rounds? →
              </motion.button>
            )}
          </motion.div>
        )}

        {step < 5 && (
          <motion.button
            className="btn btn--ghost"
            onClick={() => {
              const nextAction = narrativeSteps[step].action;
              if (nextAction) nextAction();
            }}
            style={{ marginTop: '2rem' }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {step === 0 ? 'Begin →' : 'Next →'}
          </motion.button>
        )}
      </div>
    </Section>
  );
}
