import { useState, useEffect } from 'react';

const PLAYER_ID_KEY = 'barnabus_player_id';
const COMPLETION_FLAG_KEY = 'barnabus_completed';

export function usePersistentPlayerId() {
  const [playerId, setPlayerIdState] = useState<bigint | null>(null);
  const [hasCompleted, setHasCompletedState] = useState(false);

  useEffect(() => {
    // Load player ID from localStorage on mount
    const stored = localStorage.getItem(PLAYER_ID_KEY);
    if (stored) {
      try {
        setPlayerIdState(BigInt(stored));
      } catch (error) {
        console.error('Failed to parse stored player ID:', error);
        localStorage.removeItem(PLAYER_ID_KEY);
      }
    }

    // Load completion flag
    const completionFlag = localStorage.getItem(COMPLETION_FLAG_KEY);
    setHasCompletedState(completionFlag === 'true');
  }, []);

  const setPlayerId = (id: bigint) => {
    setPlayerIdState(id);
    localStorage.setItem(PLAYER_ID_KEY, id.toString());
  };

  const markAsCompleted = () => {
    setHasCompletedState(true);
    localStorage.setItem(COMPLETION_FLAG_KEY, 'true');
  };

  const clearPlayerId = () => {
    setPlayerIdState(null);
    setHasCompletedState(false);
    localStorage.removeItem(PLAYER_ID_KEY);
    localStorage.removeItem(COMPLETION_FLAG_KEY);
  };

  return {
    playerId,
    hasCompleted,
    setPlayerId,
    markAsCompleted,
    clearPlayerId,
  };
}
