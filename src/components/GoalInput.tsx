import React, { useState } from 'react';
import { useBracket } from '../contexts/BracketContext';
import { generateMatchups, calculateRounds } from '../utils/bracketUtils';

interface GoalInputProps {
  onStartBracket?: () => void;
}

const GoalInput: React.FC<GoalInputProps> = ({ onStartBracket }) => {
  const [goalText, setGoalText] = useState('');
  const [error, setError] = useState('');
  const { 
    goals, 
    setGoals, 
    setMatchups, 
    bracketTitle, 
    setBracketTitle, 
    bracketCategory, 
    setBracketCategory 
  } = useBracket();

  const categories = ['CAREER', 'FAITH', 'FAMILY', 'FITNESS', 'FINANCIAL', 'PERSONAL', 'OTHER'];

  const handleAddGoal = () => {
    if (!goalText.trim()) {
      setError('Please enter a goal');
      return;
    }
    
    setGoals([...goals, goalText.trim()]);
    setGoalText('');
    setError('');
  };

  const handleRemoveGoal = (index: number) => {
    const updatedGoals = [...goals];
    updatedGoals.splice(index, 1);
    setGoals(updatedGoals);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddGoal();
    }
  };
  
  // Handle key down is preferred over keyPress which is deprecated
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddGoal();
    }
  };

  const handleStartBracket = () => {
    if (goals.length < 2) {
      setError('You need at least 2 goals to create a bracket');
      return;
    }

    if (!bracketTitle.trim()) {
      setError('Please enter a title for your bracket');
      return;
    }

    // Create first round matchups
    const initialMatchups = generateMatchups(goals);
    setMatchups(initialMatchups);
    
    // Notify parent component that bracket is starting
    if (onStartBracket) {
      onStartBracket();
    }
  };

  return (
    <div className="goal-input-container">
      <h2>Create Your Goal Bracket</h2>
      
      <div className="bracket-info">
        <div className="form-group">
          <label htmlFor="bracket-title">Bracket Title:</label>
          <input
            id="bracket-title"
            type="text"
            value={bracketTitle}
            onChange={(e) => setBracketTitle(e.target.value)}
            placeholder="My Goals Bracket"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="bracket-category">Category:</label>
          <select
            id="bracket-category"
            value={bracketCategory}
            onChange={(e) => setBracketCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0) + category.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="goal-entry">
        <div className="form-group">
          <label htmlFor="goal-input">Add Your Goals:</label>
          <div className="input-with-button">
            <input
              id="goal-input"
              type="text"
              value={goalText}
              onChange={(e) => setGoalText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter a goal"
            />
            <button onClick={handleAddGoal}>Add</button>
          </div>
          {error && <p className="error">{error}</p>}
        </div>
      </div>
      
      <div className="goals-list">
        <h3>Your Goals ({goals.length})</h3>
        <p className="hint">Add between 4-16 goals for the best experience</p>
        {goals.length > 0 ? (
          <ul>
            {goals.map((goal, index) => (
              <li key={index}>
                <span>{goal}</span>
                <button 
                  className="remove-btn" 
                  onClick={() => handleRemoveGoal(index)}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-state">No goals added yet</p>
        )}
      </div>
      
      {goals.length >= 2 && (
        <div className="bracket-info">
          <p>
            Your bracket will have {calculateRounds(goals.length)} rounds with {goals.length} goals.
          </p>
          <button 
            className="primary-btn"
            onClick={handleStartBracket}
          >
            Start My Bracket
          </button>
        </div>
      )}
    </div>
  );
};

export default GoalInput;
