import { useState } from 'react';
import './App.css';

function App() {
  const [gameState, setGameState] = useState({
    m_left: 3,
    c_left: 3,
    m_right: 0,
    c_right: 0,
    boat_pos: 'L'
  });
  const [isSolving, setIsSolving] = useState(false);
  const [errorLine, setErrorLine] = useState('');
  const [solutionSteps, setSolutionSteps] = useState(null);
  const [enableAnimation, setEnableAnimation] = useState(false);

  const solveAI = async () => {
    setIsSolving(true);
    setErrorLine('');
    try {
      const res = await fetch('http://localhost:8000/api/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gameState)
      });
      const data = await res.json();
      if (!data.is_solvable) {
        setErrorLine('No solution found from current state.');
        setIsSolving(false);
        return;
      }
      
      setSolutionSteps(data.path);
      if (enableAnimation) {
        animPath(data.path);
      } else {
        setIsSolving(false);
      }
    } catch (err) {
        console.error(err);
        setErrorLine('Failed to connect to backend.');
        setIsSolving(false);
    }
  };

  const animPath = (path) => {
    let step = 0;
    const interval = setInterval(() => {
      if (step >= path.length) {
        clearInterval(interval);
        setIsSolving(false);
        return;
      }
      setGameState(path[step]);
      step++;
    }, 1500); // 1.5s per step for nice slow animation
  };

  const resetGame = () => {
    if (isSolving) return;
    setGameState({
      m_left: 3, c_left: 3, m_right: 0, c_right: 0, boat_pos: 'L'
    });
    setErrorLine('');
    setSolutionSteps(null);
  };

  // Render characters
  const renderChars = (count, emoji, keyPrefix) => {
    return Array.from({ length: count }).map((_, i) => (
      <div key={`${keyPrefix}-${i}`} className="character">{emoji}</div>
    ));
  };

  return (
    <div className="game-container">
      <div className="ui-panel glass">
        <h1>Missionaries & Cannibals</h1>
        <p className="subtitle">AI Powered BFS Solver</p>
        <div className="controls">
          <button onClick={solveAI} disabled={isSolving} className="btn primary">
            {isSolving ? 'Solving...' : 'Solve puzzle'}
          </button>
          <button onClick={resetGame} disabled={isSolving} className="btn secondary">
            Reset
          </button>
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '1rem', justifyContent: 'center', cursor: 'pointer' }}>
          <input 
            type="checkbox" 
            checked={enableAnimation} 
            onChange={e => setEnableAnimation(e.target.checked)} 
            disabled={isSolving}
            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
          />
          Enable Playback Animation
        </label>
        {errorLine && <p className="error">{errorLine}</p>}
        {solutionSteps && (
          <div className="solution-steps" style={{ marginTop: '2rem', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
            <h3 style={{ textDecoration: 'underline', marginBottom: '1rem' }}>Optimal Solution ({solutionSteps.length - 1} steps):</h3>
            <ol style={{ textAlign: 'left', paddingLeft: '2rem', lineHeight: '1.6' }}>
              {solutionSteps.map((step, idx) => (
                <li key={idx}>
                  Left Bank: {step.m_left}🧔 {step.c_left}🧟 | Boat: {step.boat_pos === 'L' ? 'Left' : 'Right'} | Right Bank: {step.m_right}🧔 {step.c_right}🧟
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      <div className="world">
        <div className="bank left-bank">
          <div className="chars-container">
            {renderChars(gameState.m_left, '🧔', 'ml')}
            {renderChars(gameState.c_left, '🧟', 'cl')}
          </div>
        </div>

        <div className="river">
           {/* Animated waves overlay could go here */}
           <div className={`boat ${gameState.boat_pos === 'L' ? 'boat-left' : 'boat-right'}`}>
             🚣
           </div>
        </div>

        <div className="bank right-bank">
           <div className="chars-container">
            {renderChars(gameState.m_right, '🧔', 'mr')}
            {renderChars(gameState.c_right, '🧟', 'cr')}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
