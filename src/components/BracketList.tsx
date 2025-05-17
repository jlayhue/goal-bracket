import React, { useState, useEffect } from 'react';
import { Schema } from '../../amplify/data/resource';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';

const client = generateClient<Schema>();

// Define a type for the bracket data that matches what the API returns
interface Bracket {
  id: string;
  title: string;
  category: string | null;
  goals: (string | null)[];
  matchups: any[] | null;
  winner?: string | null;
  round: number | null;
  status: string;
  createdAt: string | null;
}

type BracketListProps = {
  onSelectBracket: (bracket: Bracket) => void;
};

const BracketList: React.FC<BracketListProps> = ({ onSelectBracket }) => {
  const [brackets, setBrackets] = useState<Bracket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      await getCurrentUser();
      setIsAuthenticated(true);
      fetchBrackets();
    } catch (err) {
      console.error('Not authenticated:', err);
      setError('Please sign in to view your brackets');
      setLoading(false);
    }
  };

  const fetchBrackets = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await client.models.GoalBracket.list();
      
      // Sort brackets by creation date, newest first
      const sortedBrackets = (result.data as Bracket[]).sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
      
      setBrackets(sortedBrackets);
    } catch (err) {
      console.error('Error fetching brackets:', err);
      if (err instanceof Error && err.message.includes('not authorized')) {
        setError('Please sign in to view your brackets');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to load your brackets. Please try again.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchBrackets();
  };

  if (!isAuthenticated) {
    return (
      <div className="bracket-list error">
        <p className="error-message">Please sign in to view your brackets</p>
      </div>
    );
  }

  if (loading && !refreshing) {
    return (
      <div className="bracket-list loading">
        <div className="loading-spinner"></div>
        <p>Loading your brackets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bracket-list error">
        <p className="error-message">{error}</p>
        <button 
          className="retry-btn"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          {refreshing ? 'Refreshing...' : 'Try Again'}
        </button>
      </div>
    );
  }

  if (brackets.length === 0) {
    return (
      <div className="bracket-list empty">
        <p>You haven't created any goal brackets yet.</p>
        <p className="hint">Create your first bracket to get started!</p>
      </div>
    );
  }

  return (
    <div className="bracket-list">
      <div className="bracket-list-header">
        <h3>Your Saved Brackets</h3>
        <button 
          className="refresh-btn"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      <ul className="brackets">
        {brackets.map(bracket => (
          <li key={bracket.id} className="bracket-item">
            <div className="bracket-info">
              <h4>{bracket.title}</h4>
              <div className="bracket-meta">
                <span className="category">{bracket.category}</span>
                <span className={`status ${bracket.status.toLowerCase()}`}>
                  {bracket.status.replace('_', ' ')}
                </span>
                {bracket.winner && (
                  <span className="winner">
                    Winner: <strong>{bracket.winner}</strong>
                  </span>
                )}
                <span className="date">
                  {bracket.createdAt ? new Date(bracket.createdAt).toLocaleDateString() : 'No date'}
                </span>
              </div>
            </div>
            <button 
              className="view-btn"
              onClick={() => onSelectBracket(bracket)}
            >
              View
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BracketList;
