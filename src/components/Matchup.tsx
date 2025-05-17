import React from 'react';

type MatchupProps = {
  goalA: string;
  goalB: string;
  onSelect: (selected: string) => void;
};

const Matchup: React.FC<MatchupProps> = ({ goalA, goalB, onSelect }) => {
  return (
    <div className="matchup-container">
      <h3>Which goal is more important to you?</h3>
      
      <div className="matchup-options">
        <button 
          className="matchup-option"
          onClick={() => onSelect(goalA)}
        >
          <span className="goal-text">{goalA}</span>
        </button>
        
        <div className="vs-indicator">VS</div>
        
        <button 
          className="matchup-option"
          onClick={() => onSelect(goalB)}
        >
          <span className="goal-text">{goalB}</span>
        </button>
      </div>
    </div>
  );
};

export default Matchup;
