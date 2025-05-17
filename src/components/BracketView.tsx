import React, { useEffect } from 'react';
import { useBracket } from '../contexts/BracketContext';
import { getCurrentRoundMatchups, getNextRoundMatchups, isRoundComplete, Matchup } from '../utils/bracketUtils';

interface BracketViewProps {
  onBack?: () => void;
}

const BracketView: React.FC<BracketViewProps> = ({ onBack }) => {
  const { 
    matchups, 
    setMatchups, 
    currentRound, 
    setCurrentRound, 
    winner, 
    setWinner,
    resetBracket
  } = useBracket();

  useEffect(() => {
    // Check if we have a winner
    const currentRoundMatchups = getCurrentRoundMatchups(matchups, currentRound);
    if (currentRoundMatchups.length === 1 && currentRoundMatchups[0].selected) {
      setWinner(currentRoundMatchups[0].selected);
    }
  }, [matchups, currentRound]);

  const handleSelectWinner = (matchupId: string, selected: string) => {
    // Update the matchup with the selected winner
    const updatedMatchups = matchups.map(matchup => 
      matchup.id === matchupId
        ? { ...matchup, selected }
        : matchup
    );
    
    setMatchups(updatedMatchups);

    // Check if all matchups in the current round are complete
    const currentRoundMatchups = getCurrentRoundMatchups(updatedMatchups, currentRound);
    if (isRoundComplete(currentRoundMatchups)) {
      // Generate next round matchups
      const nextRoundMatchups = getNextRoundMatchups(currentRoundMatchups, currentRound + 1);
      
      if (nextRoundMatchups.length > 0) {
        setMatchups([...updatedMatchups, ...nextRoundMatchups]);
        setCurrentRound(currentRound + 1);
      } else if (currentRoundMatchups.length === 1) {
        // We have a winner
        setWinner(selected);
      }
    }
  };

  // If we have a winner, display the result
  if (winner) {
    return (
      <div className="bracket-result">
        <h2>Your Top Goal</h2>
        <div className="winner-display">
          <div className="winner-badge">🏆</div>
          <h3 className="winner-text">{winner}</h3>
        </div>
        <p className="winner-message">
          Congratulations! You've determined your most important goal. 
          Now it's time to focus your energy on achieving it!
        </p>
        
        {onBack && (
          <button 
            className="back-btn" 
            onClick={() => {
              resetBracket();
              onBack();
            }}
          >
            Start Over
          </button>
        )}
      </div>
    );
  }

  // Render the bracket (revert to simple column/row structure)
  return (
    <div className="bracket-view">
      <div className="bracket-header">
        <h2>Goal Bracket</h2>
        {onBack && (
          <button 
            className="back-btn" 
            onClick={onBack}
          >
            Back
          </button>
        )}
      </div>
      <div className="bracket-grid">
        {Array.from({ length: currentRound }, (_, roundIndex) => {
          const roundNumber = roundIndex + 1;
          const roundMatchups = getCurrentRoundMatchups(matchups, roundNumber);
          return (
            <div key={roundNumber} className="bracket-round">
              <h3>Round {roundNumber}</h3>
              <div className="round-matchups">
                {roundMatchups.map((matchup) => (
                  <div 
                    key={matchup.id} 
                    className={`matchup-container ${matchup.selected ? 'completed' : ''}`}
                  >
                    <div 
                      className={`matchup-option ${matchup.selected === matchup.goalA ? 'selected' : ''}`}
                      onClick={() => !matchup.selected && handleSelectWinner(matchup.id, matchup.goalA)}
                    >
                      <p className="goal-text">{matchup.goalA}</p>
                    </div>
                    <div className="vs-indicator">VS</div>
                    <div 
                      className={`matchup-option ${matchup.selected === matchup.goalB ? 'selected' : ''}`}
                      onClick={() => !matchup.selected && handleSelectWinner(matchup.id, matchup.goalB)}
                    >
                      <p className="goal-text">{matchup.goalB}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BracketView;
