import { v4 as uuidv4 } from 'uuid';

export interface Matchup {
  id: string;
  round: number;
  goalA: string;
  goalB: string;
  selected?: string | null;
}

// Function to generate matchups for a round
export const generateMatchups = (goals: string[], round: number = 1): Matchup[] => {
  if (!Array.isArray(goals)) {
    throw new Error('Goals must be an array');
  }

  if (goals.length < 2) {
    return [];
  }

  const matchups: Matchup[] = [];
  
  // Create pairs of goals
  for (let i = 0; i < goals.length; i += 2) {
    // Check if we have a pair or just one item left
    const goalA = goals[i];
    const goalB = i + 1 < goals.length ? goals[i + 1] : null;
    
    if (goalB) {
      matchups.push({
        id: uuidv4(),
        round,
        goalA,
        goalB,
        selected: null
      });
    } else {
      // If there's an odd number of goals, the last one gets a bye to the next round
      // We'll handle this in the component that uses this function
    }
  }
  
  return matchups;
};

// Function to get next round matchups based on winners from current round
export const getNextRoundMatchups = (currentMatchups: Matchup[], round: number): Matchup[] => {
  if (!Array.isArray(currentMatchups)) {
    throw new Error('Current matchups must be an array');
  }

  const winners = currentMatchups
    .filter(matchup => matchup.selected) // Only consider matchups that have a selection
    .map(matchup => matchup.selected as string);
    
  return generateMatchups(winners, round);
};

// Function to check if all matchups in a round have been completed
export const isRoundComplete = (matchups: Matchup[]): boolean => {
  if (!Array.isArray(matchups)) {
    throw new Error('Matchups must be an array');
  }

  return matchups.every(matchup => matchup.selected !== null && matchup.selected !== undefined);
};

// Function to shuffle an array (for randomizing matchups if desired)
export const shuffleArray = <T>(array: T[]): T[] => {
  if (!Array.isArray(array)) {
    throw new Error('Input must be an array');
  }

  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Calculate the number of rounds needed based on the number of goals
export const calculateRounds = (goalsCount: number): number => {
  if (typeof goalsCount !== 'number' || goalsCount < 0) {
    throw new Error('Goals count must be a positive number');
  }

  return Math.ceil(Math.log2(goalsCount));
};

// Get matchups for the current round
export const getCurrentRoundMatchups = (matchups: Matchup[], round: number): Matchup[] => {
  if (!Array.isArray(matchups)) {
    throw new Error('Matchups must be an array');
  }

  if (typeof round !== 'number' || round < 1) {
    throw new Error('Round must be a positive number');
  }

  return matchups.filter(matchup => matchup.round === round);
};
