import React, { useState } from 'react';
import { useBracket } from '../contexts/BracketContext';
import { Schema } from '../../amplify/data/resource';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';

const client = generateClient<Schema>();

const BracketSaver: React.FC = () => {
  const { 
    bracketTitle, 
    bracketCategory, 
    goals, 
    matchups, 
    winner,
    currentRound,
    isSubmitting,
    setIsSubmitting,
    resetBracket
  } = useBracket();
  
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  
  const handleSaveBracket = async () => {
    if (!bracketTitle.trim()) {
      setSaveError('Please enter a title for your bracket');
      return;
    }

    if (goals.length < 2) {
      setSaveError('You need at least 2 goals to save a bracket');
      return;
    }

    try {
      // Check if user is authenticated
      await getCurrentUser();
      
      setIsSubmitting(true);
      setSaveError('');
      
      // Type assertion to enforce the category is one of the valid enum values
      const category = bracketCategory as "CAREER" | "FAITH" | "FAMILY" | "FITNESS" | "FINANCIAL" | "PERSONAL" | "OTHER";
      
      // Create the bracket in the database
      const result = await client.models.GoalBracket.create({
        title: bracketTitle.trim(),
        category: category,
        goals: goals.filter(goal => goal !== null), // Filter out any null goals
        matchups: matchups.map(matchup => ({
          ...matchup,
          selected: matchup.selected || null // Ensure selected is null if not set
        })),
        winner: winner || null,
        round: currentRound,
        status: winner ? 'COMPLETED' : 'IN_PROGRESS',
        createdAt: new Date().toISOString(),
      });
      
      setSaveSuccess(true);
      console.log('Bracket saved:', result);
    } catch (error) {
      console.error('Error saving bracket:', error);
      if (error instanceof Error && error.message.includes('not authorized')) {
        setSaveError('Please sign in to save your bracket');
      } else {
        setSaveError(error instanceof Error ? error.message : 'Failed to save bracket. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (saveSuccess) {
    return (
      <div className="bracket-saver success">
        <h3>Bracket Saved Successfully!</h3>
        <p>Your goal bracket has been saved to your account.</p>
        <div className="button-group">
          <button 
            className="primary-btn"
            onClick={() => {
              resetBracket();
              setSaveSuccess(false);
              setSaveError('');
            }}
          >
            Create Another Bracket
          </button>
          <button 
            className="secondary-btn"
            onClick={() => {
              resetBracket();
              setSaveSuccess(false);
              setSaveError('');
              window.location.href = '/'; // Navigate to home
            }}
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bracket-saver">
      <h3>Save Your Goal Bracket</h3>
      <p>Save your bracket to track your progress or revisit it later.</p>
      
      {saveError && <p className="error">{saveError}</p>}
      
      <button 
        className="primary-btn"
        onClick={handleSaveBracket}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Saving...' : 'Save Bracket'}
      </button>
    </div>
  );
};

export default BracketSaver;
