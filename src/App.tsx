import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { useState } from 'react';
import { BracketProvider } from './contexts/BracketContext';
import GoalInput from './components/GoalInput';
import BracketView from './components/BracketView';
import BracketList from './components/BracketList';
import BracketSaver from './components/BracketSaver';
import './App.css';

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

function App() {
  const [showBracket, setShowBracket] = useState(false);
  const [selectedBracket, setSelectedBracket] = useState<Bracket | null>(null);

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <BracketProvider>
          <div className="app-container">
            {/* Modern Top Navigation Bar */}
            <nav className="top-nav">
              <div className="app-logo">Goal Bracket</div>
              <div className="nav-user">
                <span className="user-email">Hello, {user?.signInDetails?.loginId || user?.username}</span>
                <button onClick={signOut} className="sign-out-btn">Sign out</button>
              </div>
            </nav>

            {/* Main Content Card */}
            <main className="main-content-card">
              {showBracket ? (
                <>
                  <div className="section-title">Your Bracket</div>
                  <div className="bracket-container">
                    <BracketView onBack={() => setShowBracket(false)} />
                    <BracketSaver />
                  </div>
                </>
              ) : selectedBracket ? (
                <div className="saved-bracket-view">
                  <div className="section-title">Saved Bracket</div>
                  {/* TODO: Implement the saved bracket view */}
                  <h2>{selectedBracket.title}</h2>
                  <button 
                    onClick={() => setSelectedBracket(null)}
                    className="back-btn"
                  >
                    Back to brackets
                  </button>
                </div>
              ) : (
                <div className="home-container">
                  <div>
                    <div className="section-title">Create a New Bracket</div>
                    <GoalInput onStartBracket={() => setShowBracket(true)} />
                  </div>
                  <div className="saved-brackets">
                    <div className="section-title">Your Saved Brackets</div>
                    <BracketList onSelectBracket={setSelectedBracket} />
                  </div>
                </div>
              )}
            </main>
          </div>
        </BracketProvider>
      )}
    </Authenticator>
  );
}

export default App;