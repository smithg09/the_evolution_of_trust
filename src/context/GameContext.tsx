import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface GameState {
  currentSection: number;
  totalSections: number;
  scrollEnabled: boolean;
}

interface GameContextType {
  state: GameState;
  goToSection: (index: number) => void;
  nextSection: () => void;
  prevSection: () => void;
  setScrollEnabled: (enabled: boolean) => void;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({
  children,
  totalSections,
}: {
  children: ReactNode;
  totalSections: number;
}) {
  const [state, setState] = useState<GameState>({
    currentSection: 0,
    totalSections,
    scrollEnabled: true,
  });

  const goToSection = useCallback(
    (index: number) => {
      setState((prev) => ({
        ...prev,
        currentSection: Math.max(0, Math.min(index, prev.totalSections - 1)),
      }));
    },
    []
  );

  const nextSection = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentSection: Math.min(prev.currentSection + 1, prev.totalSections - 1),
    }));
  }, []);

  const prevSection = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentSection: Math.max(prev.currentSection - 1, 0),
    }));
  }, []);

  const setScrollEnabled = useCallback((enabled: boolean) => {
    setState((prev) => ({ ...prev, scrollEnabled: enabled }));
  }, []);

  return (
    <GameContext.Provider
      value={{ state, goToSection, nextSection, prevSection, setScrollEnabled }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
}
