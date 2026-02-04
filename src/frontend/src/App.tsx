import { useState } from 'react';
import IntroFlow from './features/intro/IntroFlow';
import GameView from './features/game/GameView';
import OutroFlow from './features/outro/OutroFlow';
import HallOfFameView from './features/hall-of-fame/HallOfFameView';

type AppPhase = 'intro' | 'game' | 'outro' | 'hall-of-fame';

export default function App() {
  const [phase, setPhase] = useState<AppPhase>('intro');

  return (
    <div className="min-h-screen">
      {phase === 'intro' && (
        <IntroFlow 
          onComplete={() => setPhase('game')}
          onNavigateToHallOfFame={() => setPhase('hall-of-fame')}
        />
      )}
      {phase === 'game' && (
        <GameView 
          onFinalStarDismiss={() => setPhase('outro')}
          onNavigateToHallOfFame={() => setPhase('hall-of-fame')}
        />
      )}
      {phase === 'outro' && (
        <OutroFlow onComplete={() => setPhase('hall-of-fame')} />
      )}
      {phase === 'hall-of-fame' && (
        <HallOfFameView />
      )}
    </div>
  );
}
