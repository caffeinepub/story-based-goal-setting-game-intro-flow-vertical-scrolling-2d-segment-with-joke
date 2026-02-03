import { useEffect, useRef, useState } from 'react';

export function useGameLoop() {
  const [scrollOffset, setScrollOffset] = useState(0);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    const SCROLL_SPEED = 1; // pixels per frame

    const gameLoop = (currentTime: number) => {
      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      // Update scroll offset (map moves downward)
      setScrollOffset((prev) => prev + SCROLL_SPEED);

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return { scrollOffset };
}
