import { useEffect, useState, useCallback } from 'react';

interface Movement {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
}

export function useKeyboardControls(
  onSpacePress: () => void,
  onJokePress: () => void,
  canvasRef: React.RefObject<HTMLCanvasElement | null>
) {
  const [movement, setMovement] = useState<Movement>({
    left: false,
    right: false,
    up: false,
    down: false,
  });

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          setMovement((prev) => ({ ...prev, left: true }));
          break;
        case 'ArrowRight':
          e.preventDefault();
          setMovement((prev) => ({ ...prev, right: true }));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setMovement((prev) => ({ ...prev, up: true }));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setMovement((prev) => ({ ...prev, down: true }));
          break;
        case ' ':
          e.preventDefault();
          onSpacePress();
          break;
        case 'j':
        case 'J':
          e.preventDefault();
          onJokePress();
          break;
      }
    },
    [onSpacePress, onJokePress]
  );

  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          setMovement((prev) => ({ ...prev, left: false }));
          break;
        case 'ArrowRight':
          setMovement((prev) => ({ ...prev, right: false }));
          break;
        case 'ArrowUp':
          setMovement((prev) => ({ ...prev, up: false }));
          break;
        case 'ArrowDown':
          setMovement((prev) => ({ ...prev, down: false }));
          break;
      }
    },
    []
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return { movement };
}
