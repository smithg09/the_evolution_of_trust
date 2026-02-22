import { useState, useRef, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { Lock } from 'lucide-react';
import { SketchFilters } from './components/SketchElements';
import IntroSection from './sections/IntroSection';
import WhatIsTheGameSection from './sections/WhatIsTheGameSection';
import MeetTheCharactersSection from './sections/MeetTheCharactersSection';
import TournamentSection from './sections/TournamentSection';
import EvolutionSection from './sections/EvolutionSection';
import SandboxSection from './sections/SandboxSection';
import ConclusionSection from './sections/ConclusionSection';
import './App.css';

const sections = [
  { id: 'intro',            label: 'Start',      icon: <Icon icon="noto:house"                  width={16} height={16} /> },
  { id: 'what-is-the-game', label: 'The Game',   icon: <Icon icon="noto:puzzle-piece"           width={16} height={16} /> },
  { id: 'meet-characters',  label: 'Characters',  icon: <Icon icon="noto:busts-in-silhouette"    width={16} height={16} /> },
  { id: 'tournament',       label: 'Tournament',  icon: <Icon icon="noto:trophy"                 width={16} height={16} /> },
  { id: 'evolution',        label: 'Evolution',   icon: <Icon icon="noto:dna"                    width={16} height={16} /> },
  { id: 'sandbox',          label: 'Sandbox',     icon: <Icon icon="noto:joystick"               width={16} height={16} /> },
  { id: 'conclusion',       label: 'Lessons',     icon: <Icon icon="noto:open-book"              width={16} height={16} /> },
] as const;

type SectionId = (typeof sections)[number]['id'];

export default function App() {
  const [visibleSections, setVisibleSections] = useState<Set<SectionId>>(new Set(['intro']));
  const sectionRefs = useRef<Map<SectionId, HTMLDivElement>>(new Map());

  const unlockSection = useCallback((id: SectionId) => {
    setVisibleSections((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });

    // Scroll to the new section after a brief delay
    setTimeout(() => {
      const el = sectionRefs.current.get(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }, []);

  const setRef = useCallback((id: SectionId) => (el: HTMLDivElement | null) => {
    if (el) sectionRefs.current.set(id, el);
  }, []);

  return (
    <div className="app">
      <SketchFilters />

      {/* Game-style level progress */}
      <nav className="app__progress" aria-label="Game progress">
        {/* Connecting path */}
        <svg className="app__progress-path" viewBox="0 0 10 300" preserveAspectRatio="none">
          <path d="M5 0V300" stroke="var(--sketch-border)" strokeWidth="2" strokeDasharray="6 4" strokeLinecap="round" />
        </svg>
        {sections.map(({ id, label, icon }) => {
          const isActive = visibleSections.has(id);
          // Find the last unlocked section to mark as "current"
          const sectionIndex = sections.findIndex((s) => s.id === id);
          const activeSections = sections.filter((s) => visibleSections.has(s.id));
          const lastActiveIndex = sections.findIndex(
            (s) => s.id === activeSections[activeSections.length - 1]?.id
          );
          const isCurrent = isActive && sectionIndex === lastActiveIndex;
          const isVisited = isActive && !isCurrent;

          const nodeClass = isCurrent
            ? 'app__progress-node app__progress-node--current'
            : isVisited
              ? 'app__progress-node app__progress-node--visited'
              : 'app__progress-node app__progress-node--locked';

          return (
            <button
              key={id}
              className={nodeClass}
              onClick={() => {
                if (isActive) {
                  sectionRefs.current.get(id)?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              title={label}
              aria-label={`${label}${isActive ? '' : ' (locked)'}`}
              disabled={!isActive}
            >
              <span className="app__progress-icon">{isActive ? icon : <Lock size={10} />}</span>
            </button>
          );
        })}
      </nav>

      {/* Sections */}
      <div ref={setRef('intro')}>
        <IntroSection onStart={() => unlockSection('what-is-the-game')} />
      </div>

      {visibleSections.has('what-is-the-game') && (
        <div ref={setRef('what-is-the-game')}>
          <WhatIsTheGameSection onComplete={() => unlockSection('meet-characters')} />
        </div>
      )}

      {visibleSections.has('meet-characters') && (
        <div ref={setRef('meet-characters')}>
          <MeetTheCharactersSection onComplete={() => unlockSection('tournament')} />
        </div>
      )}

      {visibleSections.has('tournament') && (
        <div ref={setRef('tournament')}>
          <TournamentSection onComplete={() => unlockSection('evolution')} />
        </div>
      )}

      {visibleSections.has('evolution') && (
        <div ref={setRef('evolution')}>
          <EvolutionSection onComplete={() => unlockSection('sandbox')} />
        </div>
      )}

      {visibleSections.has('sandbox') && (
        <div ref={setRef('sandbox')}>
          <SandboxSection onComplete={() => unlockSection('conclusion')} />
        </div>
      )}

      {visibleSections.has('conclusion') && (
        <div ref={setRef('conclusion')}>
          <ConclusionSection />
        </div>
      )}
    </div>
  );
}
