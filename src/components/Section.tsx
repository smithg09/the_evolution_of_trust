
import { motion } from 'framer-motion';
import './Section.css';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}

export default function Section({ children, className = '', dark = false }: SectionProps) {
  return (
    <motion.section
      className={`game-section ${dark ? 'game-section--dark' : ''} ${className}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
    >
      <div className="game-section__inner">{children}</div>
    </motion.section>
  );
}
