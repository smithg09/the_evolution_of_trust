
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import Section from '../components/Section';
import { TapeStrip, NotebookCorner, GameBadge } from '../components/SketchElements';
import './ConclusionSection.css';

export default function ConclusionSection() {
  const lessons = [
    {
      icon: <Icon icon="noto:counterclockwise-arrows-button" width={28} height={28} />,
      color: 'var(--neon-blue)',
      title: 'Repeat Interactions',
      text: 'Trust cannot evolve in one-shot encounters. Repeated interactions are the foundation of cooperation.',
    },
    {
      icon: <Icon icon="noto:handshake" width={28} height={28} />,
      color: 'var(--neon-green)',
      title: 'Start Nice',
      text: "The winning strategies are 'nice' — they cooperate first and never initiate betrayal.",
    },
    {
      icon: <Icon icon="noto:high-voltage" width={28} height={28} />,
      color: '#fbbf24',
      title: 'Retaliate',
      text: "Being nice doesn't mean being a pushover. Successful strategies punish cheaters.",
    },
    {
      icon: <Icon icon="noto:yellow-heart" width={28} height={28} />,
      color: '#f87171',
      title: 'Forgive',
      text: "But hold grudges loosely. The best strategies forgive and return to cooperation.",
    },
    {
      icon: <Icon icon="noto:dna" width={28} height={28} />,
      color: 'var(--neon-purple)',
      title: "Don't Be Envious",
      text: "Success isn't about beating the other player. It's about mutual benefit over time.",
    },
    {
      icon: <Icon icon="noto:globe-showing-europe-africa" width={28} height={28} />,
      color: '#22d3ee',
      title: 'Change the Game',
      text: 'The rules of the game shape the players. To get more trust, build systems that reward it.',
    },
  ];

  return (
    <Section className="conclusion-section" dark>
      <div className="conclusion-section__content">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          What We Learned
        </motion.h2>

        <GameBadge label="Key Takeaways" color="var(--neon-purple)" className="conclusion-section__badge" />

        <p className="narrative-text" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          The paradox of trust follows some surprisingly simple rules:
        </p>

        <div className="conclusion-section__lessons">
          {lessons.map((lesson, i) => (
            <motion.div
              key={i}
              className="conclusion-lesson"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <TapeStrip className="conclusion-lesson__tape" rotation={i % 2 === 0 ? -3 : 3} color={lesson.color} />
              <span className="conclusion-lesson__icon" style={{ color: lesson.color, borderColor: lesson.color, background: `color-mix(in srgb, ${lesson.color} 10%, transparent)` }}>{lesson.icon}</span>
              <div>
                <h3 className="conclusion-lesson__title">{lesson.title}</h3>
                <p className="conclusion-lesson__text">{lesson.text}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="conclusion-section__final"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <div style={{ position: 'relative' }}>
            <NotebookCorner className="conclusion-section__quote-corner" position="top-right" />
            <p className="conclusion-section__quote">
              "It's not survival of the fittest. It's survival of the <em>fit-together</em>."
            </p>
          </div>

          <div className="conclusion-section__credits">
            <p>
              Inspired by{' '}
              <a href="https://www.youtube.com/watch?v=mScpHTIi-kM" target="_blank" rel="noopener noreferrer">
                Veritasium's game theory deep-dive
              </a>
            </p>
            <p>
              Based on{' '}
              <a href="https://archive.org/details/evolutionofcoop00axel/mode/2up" target="_blank" rel="noopener noreferrer">
                Axelrod's <em>The Evolution of Cooperation</em> (1984)
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
