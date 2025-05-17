import React, { createContext, useContext, useState, ReactNode } from 'react';

type Goal = string;

type Matchup = {
  id: string;
  round: number;
  goalA: string;
  goalB: string;
  selected?: string;
};

type BracketContextType = {
  goals: Goal[];
  setGoals: (goals: Goal[]) => void;
  matchups: Matchup[];
  setMatchups: (matchups: Matchup[]) => void;
  currentRound: number;
  setCurrentRound: (round: number) => void;
  winner: string | null;
  setWinner: (winner: string | null) => void;
  bracketTitle: string;
  setBracketTitle: (title: string) => void;
  bracketCategory: string;
  setBracketCategory: (category: string) => void;
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
  resetBracket: () => void;
};

const BracketContext = createContext<BracketContextType | undefined>(undefined);

export const BracketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [matchups, setMatchups] = useState<Matchup[]>([]);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [winner, setWinner] = useState<string | null>(null);
  const [bracketTitle, setBracketTitle] = useState<string>('');
  const [bracketCategory, setBracketCategory] = useState<string>('PERSONAL');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const resetBracket = () => {
    setGoals([]);
    setMatchups([]);
    setCurrentRound(1);
    setWinner(null);
    setBracketTitle('');
    setBracketCategory('PERSONAL');
    setIsSubmitting(false);
  };

  const value = {
    goals,
    setGoals,
    matchups,
    setMatchups,
    currentRound,
    setCurrentRound,
    winner,
    setWinner,
    bracketTitle,
    setBracketTitle,
    bracketCategory,
    setBracketCategory,
    isSubmitting,
    setIsSubmitting,
    resetBracket,
  };

  return <BracketContext.Provider value={value}>{children}</BracketContext.Provider>;
};

export const useBracket = (): BracketContextType => {
  const context = useContext(BracketContext);
  if (context === undefined) {
    throw new Error('useBracket must be used within a BracketProvider');
  }
  return context;
};
