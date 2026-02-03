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
  const characterRef = useRef<Character>({ x: 200, y: 400 });
  const [currentJoke, setCurrentJoke] = useState<string | null>(null);
  const [jokePosition, setJokePosition] = useState({ x: 0, y: 0 });

  const CANVAS_WIDTH = 500;
  const CANVAS_HEIGHT = 600;
  const CHARACTER_SIZE = 30;
  const MOVE_SPEED = 5;

  const { scrollOffset } = useGameLoop();

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

  useEffect(() => {
    const character = characterRef.current;

    // Update character position based on keyboard input
    if (movement.left && character.x > CHARACTER_SIZE / 2) {
      character.x -= MOVE_SPEED;
    }
    if (movement.right && character.x < CANVAS_WIDTH - CHARACTER_SIZE / 2) {
      character.x += MOVE_SPEED;
    }
    if (movement.up && character.y > CHARACTER_SIZE / 2) {
      character.y -= MOVE_SPEED;
    }
    if (movement.down && character.y < CANVAS_HEIGHT - CHARACTER_SIZE / 2) {
      character.y += MOVE_SPEED;
    }
  }, [movement]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw brown scrolling background with pattern
    const brownShades = [
      'oklch(0.45 0.06 60)',
      'oklch(0.40 0.05 55)',
      'oklch(0.35 0.04 50)',
    ];

    // Create vertical stripes that scroll
    const stripeHeight = 100;
    const offsetY = scrollOffset % stripeHeight;

    for (let y = -stripeHeight; y < CANVAS_HEIGHT + stripeHeight; y += stripeHeight) {
      const shadeIndex = Math.floor((y + offsetY) / stripeHeight) % brownShades.length;
      ctx.fillStyle = brownShades[shadeIndex];
      ctx.fillRect(0, y - offsetY, CANVAS_WIDTH, stripeHeight);
    }

    // Draw some terrain details (rocks/obstacles)
    ctx.fillStyle = 'oklch(0.30 0.04 45)';
    const rockPositions = [
      { x: 100, y: 150 },
      { x: 300, y: 250 },
      { x: 150, y: 400 },
      { x: 400, y: 100 },
    ];

    rockPositions.forEach((rock) => {
      const rockY = (rock.y + scrollOffset) % (CANVAS_HEIGHT + 100);
      ctx.beginPath();
      ctx.arc(rock.x, rockY, 15, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw character (Donald)
    const character = characterRef.current;
    ctx.fillStyle = 'oklch(0.70 0.15 30)'; // Warm orange-brown for character
    ctx.beginPath();
    ctx.arc(character.x, character.y, CHARACTER_SIZE / 2, 0, Math.PI * 2);
    ctx.fill();

    // Draw character face
    ctx.fillStyle = 'oklch(0.20 0.02 30)';
    // Eyes
    ctx.beginPath();
    ctx.arc(character.x - 8, character.y - 3, 3, 0, Math.PI * 2);
    ctx.arc(character.x + 8, character.y - 3, 3, 0, Math.PI * 2);
    ctx.fill();
    // Smile
    ctx.beginPath();
    ctx.arc(character.x, character.y + 2, 8, 0, Math.PI);
    ctx.stroke();
  }, [scrollOffset]);

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
