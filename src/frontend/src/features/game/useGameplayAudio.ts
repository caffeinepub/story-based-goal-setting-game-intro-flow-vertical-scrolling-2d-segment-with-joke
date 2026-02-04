import { useRef, useEffect, useCallback } from 'react';

interface UseGameplayAudioReturn {
  playStarCollectedSound: () => void;
  startBackgroundMusic: () => void;
  stopBackgroundMusic: () => void;
}

/**
 * Custom hook that manages gameplay audio:
 * - Background music (background.mp3) that plays during gameplay
 * - Star collection sound (star-collected.mp3) that pauses background music for exactly 4.5 seconds
 */
export function useGameplayAudio(): UseGameplayAudioReturn {
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);
  const starCollectedAudioRef = useRef<HTMLAudioElement | null>(null);
  const musicStartedRef = useRef(false);
  const resumeTimeoutRef = useRef<number | null>(null);
  const resumeTokenRef = useRef<number>(0);

  // Initialize audio assets
  useEffect(() => {
    // Background music
    const music = new Audio('/assets/background.mp3');
    music.loop = true;
    music.volume = 0.3;
    music.preload = 'auto';
    backgroundMusicRef.current = music;

    // Star collected sound - reduced volume
    const starAudio = new Audio('/assets/star-collected.mp3');
    starAudio.preload = 'auto';
    starAudio.volume = 0.4; // Reduced from default 1.0 to be noticeably quieter
    starCollectedAudioRef.current = starAudio;

    // Cleanup on unmount
    return () => {
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current.currentTime = 0;
      }
      if (resumeTimeoutRef.current !== null) {
        clearTimeout(resumeTimeoutRef.current);
      }
      musicStartedRef.current = false;
    };
  }, []);

  // Stable function references using useCallback
  const startBackgroundMusic = useCallback(() => {
    if (!backgroundMusicRef.current || musicStartedRef.current) return;

    const playPromise = backgroundMusicRef.current.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          musicStartedRef.current = true;
        })
        .catch(() => {
          // Autoplay blocked - will be retried on user interaction
          musicStartedRef.current = false;
        });
    }
  }, []);

  const stopBackgroundMusic = useCallback(() => {
    if (!backgroundMusicRef.current) return;
    
    backgroundMusicRef.current.pause();
    backgroundMusicRef.current.currentTime = 0;
    musicStartedRef.current = false;
  }, []);

  const playStarCollectedSound = useCallback(() => {
    const starAudio = starCollectedAudioRef.current;
    const bgMusic = backgroundMusicRef.current;

    if (!starAudio) return;

    // Clear any pending resume timeout to handle rapid pickups
    if (resumeTimeoutRef.current !== null) {
      clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }

    // Increment resume token for this pickup (last-request-wins)
    resumeTokenRef.current += 1;
    const currentToken = resumeTokenRef.current;

    // Pause background music immediately
    const wasMusicPlaying = bgMusic && !bgMusic.paused;
    if (wasMusicPlaying && bgMusic) {
      bgMusic.pause();
    }

    // Play star collected sound
    starAudio.currentTime = 0;
    starAudio.play().catch(() => {
      // Ignore play errors
    });

    // Schedule background music resume deterministically after exactly 4.5 seconds
    // This happens regardless of whether the star sound plays successfully
    resumeTimeoutRef.current = window.setTimeout(() => {
      // Only resume if this is still the most recent pickup request
      if (currentToken === resumeTokenRef.current && wasMusicPlaying && bgMusic) {
        // Restart from beginning
        bgMusic.currentTime = 0;
        const playPromise = bgMusic.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // If play fails, try again after a short delay
            setTimeout(() => {
              if (bgMusic && currentToken === resumeTokenRef.current) {
                bgMusic.currentTime = 0;
                bgMusic.play().catch(() => {
                  // Final attempt failed, ignore
                });
              }
            }, 100);
          });
        }
      }
      resumeTimeoutRef.current = null;
    }, 4500); // 4.5 seconds
  }, []);

  return {
    playStarCollectedSound,
    startBackgroundMusic,
    stopBackgroundMusic,
  };
}
