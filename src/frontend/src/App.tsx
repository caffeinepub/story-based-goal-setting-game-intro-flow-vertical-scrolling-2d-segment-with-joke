import { useState } from 'react';
import IntroFlow from './features/intro/IntroFlow';
import GameView from './features/game/GameView';
import OutroFlow from './features/outro/OutroFlow';

type AppPhase = 'intro' | 'game' | 'outro';

export default function App() {
  const [phase, setPhase] = useState<AppPhase>('intro');

  return (
    <div className="min-h-screen">
      {phase === 'intro' && (
        <IntroFlow onComplete={() => setPhase('game')} />
      )}
      {phase === 'game' && (
        <GameView onFinalStarDismiss={() => setPhase('outro')} />
      )}
      {phase === 'outro' && (
        <OutroFlow />
      )}
    </div>
  );
}
