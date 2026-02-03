import { useState } from 'react';
import IntroFlow from './features/intro/IntroFlow';
import GameView from './features/game/GameView';

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <div className="min-h-screen">
      {!gameStarted ? (
        <IntroFlow onComplete={() => setGameStarted(true)} />
      ) : (
        <GameView />
      )}
    </div>
  );
}
