import { useEffect, useRef } from 'react';

interface GameLoopCallbacks {
  onUpdate: (deltaTime: number) => void;
}

export function useGameLoop(callbacks?: GameLoopCallbacks) {
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    const gameLoop = (currentTime: number) => {
      // Calculate delta time in seconds
      const deltaTime = lastTimeRef.current === 0 ? 0 : (currentTime - lastTimeRef.current) / 1000;
      lastTimeRef.current = currentTime;

      // Call update callback if provided
      if (callbacks?.onUpdate && deltaTime > 0) {
        callbacks.onUpdate(deltaTime);
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [callbacks]);

  return {};
}
