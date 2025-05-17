import React from 'react';
import { useBracket } from '../contexts/BracketContext';
import { getCurrentRoundMatchups } from '../utils/bracketUtils';

const BracketVisualizer: React.FC = () => {
  const { matchups, currentRound, winner } = useBracket();
  
  // Get all rounds
  const allRounds = Array.from(
    new Set(matchups.map(matchup => matchup.round))
  ).sort((a, b) => a - b);
  
  // Function to get matchups for a specific round
  const getMatchupsForRound = (round: number) => {
    return matchups.filter(matchup => matchup.round === round);
  };
  
  // Function to render a single matchup
  const renderMatchup = (matchup: any) => {
    const isCompleted = !!matchup.selected;
    const selectedA = matchup.selected === matchup.goalA;
    const selectedB = matchup.selected === matchup.goalB;
    
    return (
      <div 
        key={matchup.id} 
        className={`bracket-matchup ${isCompleted ? 'completed' : ''}`}
      >
        <div 
          className={`bracket-team ${selectedA ? 'winner' : ''} ${!isCompleted ? 'active' : ''}`}
        >
          {matchup.goalA}
        </div>
        <div 
          className={`bracket-team ${selectedB ? 'winner' : ''} ${!isCompleted ? 'active' : ''}`}
        >
          {matchup.goalB}
        </div>
      </div>
    );
  };
  
  // Function to render a round
  const renderRound = (round: number) => {
    const roundMatchups = getMatchupsForRound(round);
    const isCurrentRound = round === currentRound;
    
    return (
      <div 
        key={round} 
        className={`bracket-round ${isCurrentRound ? 'current' : ''}`}
      >
        <h3 className="round-title">Round {round}</h3>
        <div className="round-matchups">
          {roundMatchups.map(renderMatchup)}
        </div>
      </div>
    );
  };
  
  // Render the winner if we have one
  if (winner) {
    return (
      <div className="bracket-visualizer">
        <div className="bracket-rounds">
          {allRounds.map(renderRound)}
        </div>
        <div className="bracket-winner">
          <h3 className="winner-title">Winner</h3>
          <div className="winner-name">{winner}</div>
        </div>
      </div>
    );
  }
  
  // Otherwise, render the bracket in progress
  return (
    <div className="bracket-visualizer">
      <div className="bracket-rounds">
        {allRounds.map(renderRound)}
      </div>
    </div>
  );
};

export default BracketVisualizer;
