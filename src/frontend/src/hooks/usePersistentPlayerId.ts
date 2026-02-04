import { useState, useEffect } from 'react';

const PLAYER_ID_KEY = 'barnabus_player_id';

export function usePersistentPlayerId() {
  const [playerId, setPlayerIdState] = useState<bigint | null>(null);

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
  }, []);

  const setPlayerId = (id: bigint) => {
    setPlayerIdState(id);
    localStorage.setItem(PLAYER_ID_KEY, id.toString());
  };

  const clearPlayerId = () => {
    setPlayerIdState(null);
    localStorage.removeItem(PLAYER_ID_KEY);
  };

  return {
    playerId,
    setPlayerId,
    clearPlayerId,
  };
}
