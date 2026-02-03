import { useRef, useEffect, useState } from 'react';
import { useGameLoop } from './useGameLoop';
import { useKeyboardControls } from './useKeyboardControls';
import { jokes } from './jokes';
import SpeechBalloon from './SpeechBalloon';

interface Character {
  x: number;
  y: number;
}

export default function GameView() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const characterRef = useRef<Character>({ x: 250, y: 300 });
  const worldOffsetRef = useRef<number>(0);
  const donaldImageRef = useRef<HTMLImageElement | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentJoke, setCurrentJoke] = useState<string | null>(null);
  const [jokePosition, setJokePosition] = useState({ x: 0, y: 0 });

  const CANVAS_WIDTH = 500;
  const CANVAS_HEIGHT = 600;
  const CHARACTER_SIZE = 64;
  const MOVE_SPEED = 150; // pixels per second
  const WORLD_SCROLL_SPEED = 30; // pixels per second for automatic downward progression

  // Load Donald pixel character image
  useEffect(() => {
    const img = new Image();
    img.src = '/assets/generated/donald-pixel.dim_64x64.png';
    img.onload = () => {
      donaldImageRef.current = img;
      setImageLoaded(true);
    };
  }, []);

  const handleSpacePress = () => {
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    setCurrentJoke(randomJoke);
    setJokePosition({
      x: characterRef.current.x,
      y: characterRef.current.y - 80,
    });
    setTimeout(() => setCurrentJoke(null), 3000);
  };

  const { movement } = useKeyboardControls(handleSpacePress);

  // Render function
  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw brown Zelda-inspired terrain with scrolling
    const brownShades = [
      'oklch(0.45 0.06 60)', // lighter brown
      'oklch(0.40 0.05 55)', // medium brown
      'oklch(0.35 0.04 50)', // darker brown
    ];

    // Create vertical terrain stripes that scroll with world offset
    const stripeHeight = 100;
    const offsetY = worldOffsetRef.current % stripeHeight;

    for (let y = -stripeHeight; y < CANVAS_HEIGHT + stripeHeight; y += stripeHeight) {
      const shadeIndex = Math.floor((y + offsetY) / stripeHeight) % brownShades.length;
      ctx.fillStyle = brownShades[shadeIndex];
      ctx.fillRect(0, y - offsetY, CANVAS_WIDTH, stripeHeight);
    }

    // Draw terrain details (rocks/grass patches) - purely visual, no collision
    ctx.fillStyle = 'oklch(0.30 0.04 45)';
    const terrainDetails = [
      { x: 100, y: 150 },
      { x: 300, y: 250 },
      { x: 150, y: 400 },
      { x: 400, y: 100 },
      { x: 50, y: 500 },
      { x: 450, y: 350 },
    ];

    terrainDetails.forEach((detail) => {
      const detailY = (detail.y + worldOffsetRef.current) % (CANVAS_HEIGHT + 200) - 100;
      ctx.beginPath();
      ctx.arc(detail.x, detailY, 15, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw character (Donald) - pixel art humanoid
    const character = characterRef.current;
    if (imageLoaded && donaldImageRef.current) {
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(
        donaldImageRef.current,
        character.x - CHARACTER_SIZE / 2,
        character.y - CHARACTER_SIZE / 2,
        CHARACTER_SIZE,
        CHARACTER_SIZE
      );
    }
  };

  // Game loop with deltaTime-based updates
  useGameLoop({
    onUpdate: (deltaTime: number) => {
      const character = characterRef.current;

      // Smooth continuous movement based on held keys
      if (movement.left && character.x > CHARACTER_SIZE / 2) {
        character.x -= MOVE_SPEED * deltaTime;
      }
      if (movement.right && character.x < CANVAS_WIDTH - CHARACTER_SIZE / 2) {
        character.x += MOVE_SPEED * deltaTime;
      }
      if (movement.up && character.y > CHARACTER_SIZE / 2) {
        character.y -= MOVE_SPEED * deltaTime;
      }
      if (movement.down && character.y < CANVAS_HEIGHT - CHARACTER_SIZE / 2) {
        character.y += MOVE_SPEED * deltaTime;
      }

      // Automatic world progression (top-to-bottom camera-like scroll)
      worldOffsetRef.current += WORLD_SCROLL_SPEED * deltaTime;

      // Render the frame
      render();
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-800 to-stone-900 flex flex-col items-center justify-center p-6">
      <div className="mb-6 text-center space-y-2">
        <h1 className="text-3xl font-bold text-amber-200">Follow Donald's Journey</h1>
        <p className="text-stone-300">Use arrow keys to move • Press Space to tell a joke</p>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="border-4 border-amber-700 rounded-lg shadow-2xl bg-stone-900"
          tabIndex={0}
        />

        {currentJoke && (
          <SpeechBalloon
            text={currentJoke}
            x={jokePosition.x}
            y={jokePosition.y}
            canvasWidth={CANVAS_WIDTH}
          />
        )}
      </div>

      <div className="mt-8 text-center text-stone-400 text-sm max-w-md">
        <p>
          Donald walks through the landscape of his ambitions. Each step forward is a choice, each
          joke a moment of lightness in the journey.
        </p>
      </div>

      <footer className="mt-12 text-center text-stone-500 text-sm">
        © 2026. Built with love using{' '}
        <a
          href="https://caffeine.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-600 hover:text-amber-500 underline"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
