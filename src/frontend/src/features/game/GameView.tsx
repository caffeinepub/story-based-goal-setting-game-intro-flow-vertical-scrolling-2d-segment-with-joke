import { useRef, useEffect, useState } from 'react';
import { useGameLoop } from './useGameLoop';
import { useKeyboardControls } from './useKeyboardControls';
import { jokes } from './jokes';
import SpeechBalloon from './SpeechBalloon';
import GoalsModal from './GoalsModal';
import CollectiblesHud from './CollectiblesHud';
import { getFinalIntroGradient } from '../intro/introBackground';
import {
  WORLD_BOUNDS,
  TILE_REGIONS,
  OBSTACLES,
  checkCollision,
  clampToWorldBounds,
  getObstacleColor,
  getSpawnPosition,
  isInsideCorridor,
  getCollectibles,
  type Collectible,
} from './worldMap';

interface Character {
  x: number;
  y: number;
}

interface Camera {
  x: number;
  y: number;
}

export default function GameView() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spawnPos = getSpawnPosition();
  const characterRef = useRef<Character>({ x: spawnPos.x, y: spawnPos.y });
  const cameraRef = useRef<Camera>({ x: spawnPos.x, y: spawnPos.y });
  const donaldImageRef = useRef<HTMLImageElement | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentJoke, setCurrentJoke] = useState<string | null>(null);
  const [jokePosition, setJokePosition] = useState({ x: 0, y: 0 });
  const jokeTimeoutRef = useRef<number | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const spinTimeoutRef = useRef<number | null>(null);
  const spinRotationRef = useRef<number>(0);

  // First movement detection and goals modal
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const hasMovedRef = useRef(false);
  const firstMovementTimerRef = useRef<number | null>(null);
  const previousPositionRef = useRef({ x: spawnPos.x, y: spawnPos.y });

  // Collectibles state
  const collectiblesRef = useRef<Collectible[]>(getCollectibles());
  const [collectedCount, setCollectedCount] = useState(0);
  const COLLECTIBLE_SIZE = 20;
  const COLLECTIBLE_PICKUP_RADIUS = 25; // Tight radius for "almost touching"

  // Audio for star pickup
  const pickupAudioRef = useRef<HTMLAudioElement | null>(null);

  const CANVAS_WIDTH = 500;
  const CANVAS_HEIGHT = 600;
  const CHARACTER_SIZE = 64;
  const MOVE_SPEED = 180; // pixels per second - Zelda-like movement speed
  const CAMERA_SMOOTHING = 0.1; // Camera follow smoothing factor
  const SPIN_DURATION = 600; // milliseconds for one full spin

  // Load Donald pixel character image with error handling
  useEffect(() => {
    const img = new Image();
    img.src = '/assets/generated/donald-pixel.dim_64x64.png';
    img.onload = () => {
      donaldImageRef.current = img;
      setImageLoaded(true);
      setImageError(false);
    };
    img.onerror = () => {
      setImageError(true);
      setImageLoaded(false);
    };
  }, []);

  // Load pickup sound effect
  useEffect(() => {
    const audio = new Audio('/assets/sfx/star-pickup.mp3');
    audio.preload = 'auto';
    pickupAudioRef.current = audio;
  }, []);

  const handleSpacePress = () => {
    // Clear any existing spin timeout
    if (spinTimeoutRef.current !== null) {
      clearTimeout(spinTimeoutRef.current);
    }

    // Start spinning (always happens)
    setIsSpinning(true);
    spinRotationRef.current = 0;

    // Stop spinning after duration
    spinTimeoutRef.current = window.setTimeout(() => {
      setIsSpinning(false);
      spinRotationRef.current = 0;
      spinTimeoutRef.current = null;
    }, SPIN_DURATION);

    // Check for star pickup (only when Space is pressed and very close)
    const character = characterRef.current;
    let collected = false;

    collectiblesRef.current.forEach((collectible) => {
      if (!collectible.collected) {
        const dx = character.x - collectible.x;
        const dy = character.y - collectible.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < COLLECTIBLE_PICKUP_RADIUS) {
          collectible.collected = true;
          collected = true;
          setCollectedCount((prev) => Math.min(prev + 1, 7));
        }
      }
    });

    // Play pickup sound only if a star was collected
    if (collected && pickupAudioRef.current) {
      pickupAudioRef.current.currentTime = 0;
      pickupAudioRef.current.play().catch(() => {
        // Ignore audio play errors (e.g., user hasn't interacted with page yet)
      });
    }
  };

  const handleJokePress = () => {
    // Clear any existing timeout to prevent race conditions
    if (jokeTimeoutRef.current !== null) {
      clearTimeout(jokeTimeoutRef.current);
    }

    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    setCurrentJoke(randomJoke);
    
    // Update joke position relative to canvas (screen space)
    const screenX = CANVAS_WIDTH / 2;
    const screenY = CANVAS_HEIGHT / 2 - 80;
    setJokePosition({ x: screenX, y: screenY });

    // Set new timeout and store reference
    jokeTimeoutRef.current = window.setTimeout(() => {
      setCurrentJoke(null);
      jokeTimeoutRef.current = null;
    }, 3000);
  };

  const { movement } = useKeyboardControls(handleSpacePress, handleJokePress, canvasRef);

  // Render function with world-space camera transform
  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const camera = cameraRef.current;

    // Save context state
    ctx.save();

    // Apply camera transform (translate world relative to camera)
    const cameraOffsetX = CANVAS_WIDTH / 2 - camera.x;
    const cameraOffsetY = CANVAS_HEIGHT / 2 - camera.y;
    ctx.translate(cameraOffsetX, cameraOffsetY);

    // Draw tile regions (corridor floor)
    TILE_REGIONS.forEach((region) => {
      ctx.fillStyle = region.color;
      ctx.fillRect(region.x, region.y, region.width, region.height);
    });

    // Draw subtle grid lines along the corridor for visual structure
    ctx.strokeStyle = 'oklch(0.30 0.03 45 / 0.3)';
    ctx.lineWidth = 1;
    for (let y = 0; y <= WORLD_BOUNDS.maxY; y += 100) {
      ctx.beginPath();
      ctx.moveTo(WORLD_BOUNDS.minX, y);
      ctx.lineTo(WORLD_BOUNDS.maxX, y);
      ctx.stroke();
    }

    // Draw obstacles
    OBSTACLES.forEach((obstacle) => {
      ctx.fillStyle = getObstacleColor(obstacle.type);
      
      if (obstacle.type === 'rock') {
        // Draw rocks as circles
        ctx.beginPath();
        ctx.arc(
          obstacle.x + obstacle.width / 2,
          obstacle.y + obstacle.height / 2,
          obstacle.width / 2,
          0,
          Math.PI * 2
        );
        ctx.fill();
      } else if (obstacle.type === 'tree') {
        // Draw trees as circles with darker center
        ctx.beginPath();
        ctx.arc(
          obstacle.x + obstacle.width / 2,
          obstacle.y + obstacle.height / 2,
          obstacle.width / 2,
          0,
          Math.PI * 2
        );
        ctx.fill();
        ctx.fillStyle = 'oklch(0.25 0.06 130)';
        ctx.beginPath();
        ctx.arc(
          obstacle.x + obstacle.width / 2,
          obstacle.y + obstacle.height / 2,
          obstacle.width / 4,
          0,
          Math.PI * 2
        );
        ctx.fill();
      } else {
        // Draw walls as rectangles
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      }
    });

    // Draw collectibles (stars)
    collectiblesRef.current.forEach((collectible) => {
      if (!collectible.collected) {
        // Draw a gold star
        ctx.fillStyle = 'oklch(0.85 0.15 85)'; // Bright gold/yellow
        ctx.strokeStyle = 'oklch(0.65 0.18 75)'; // Darker gold outline
        ctx.lineWidth = 2;
        
        // Draw 5-pointed star
        const centerX = collectible.x;
        const centerY = collectible.y;
        const outerRadius = COLLECTIBLE_SIZE / 2;
        const innerRadius = outerRadius * 0.4;
        
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const outerAngle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
          const innerAngle = ((i * 2 + 1) * Math.PI) / 5 - Math.PI / 2;
          
          const outerX = centerX + Math.cos(outerAngle) * outerRadius;
          const outerY = centerY + Math.sin(outerAngle) * outerRadius;
          const innerX = centerX + Math.cos(innerAngle) * innerRadius;
          const innerY = centerY + Math.sin(innerAngle) * innerRadius;
          
          if (i === 0) {
            ctx.moveTo(outerX, outerY);
          } else {
            ctx.lineTo(outerX, outerY);
          }
          ctx.lineTo(innerX, innerY);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    });

    // Draw character (Donald) with fallback and optional spin
    const character = characterRef.current;
    
    // Apply spin rotation if active
    if (isSpinning) {
      ctx.save();
      ctx.translate(character.x, character.y);
      ctx.rotate(spinRotationRef.current);
      ctx.translate(-character.x, -character.y);
    }

    if (imageLoaded && donaldImageRef.current) {
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(
        donaldImageRef.current,
        character.x - CHARACTER_SIZE / 2,
        character.y - CHARACTER_SIZE / 2,
        CHARACTER_SIZE,
        CHARACTER_SIZE
      );
    } else {
      // Fallback: Draw pixel-art style silhouette
      ctx.fillStyle = 'oklch(0.65 0.15 30)'; // Orange-brown color
      
      // Body
      ctx.fillRect(
        character.x - CHARACTER_SIZE / 4,
        character.y - CHARACTER_SIZE / 4,
        CHARACTER_SIZE / 2,
        CHARACTER_SIZE / 2
      );
      
      // Head
      ctx.fillStyle = 'oklch(0.75 0.12 40)';
      ctx.fillRect(
        character.x - CHARACTER_SIZE / 6,
        character.y - CHARACTER_SIZE / 2.5,
        CHARACTER_SIZE / 3,
        CHARACTER_SIZE / 3
      );
      
      // Eyes
      ctx.fillStyle = 'oklch(0.20 0.02 40)';
      ctx.fillRect(
        character.x - CHARACTER_SIZE / 8,
        character.y - CHARACTER_SIZE / 3,
        4,
        4
      );
      ctx.fillRect(
        character.x + CHARACTER_SIZE / 16,
        character.y - CHARACTER_SIZE / 3,
        4,
        4
      );
    }

    if (isSpinning) {
      ctx.restore();
    }

    // Restore context state
    ctx.restore();
  };

  // Game loop with deltaTime-based updates
  useGameLoop({
    onUpdate: (deltaTime: number) => {
      const character = characterRef.current;
      const camera = cameraRef.current;

      // Update spin rotation if spinning
      if (isSpinning) {
        spinRotationRef.current += (Math.PI * 2 * deltaTime * 1000) / SPIN_DURATION;
      }

      // Calculate desired new position
      let newX = character.x;
      let newY = character.y;

      if (movement.left) {
        newX -= MOVE_SPEED * deltaTime;
      }
      if (movement.right) {
        newX += MOVE_SPEED * deltaTime;
      }
      if (movement.up) {
        newY -= MOVE_SPEED * deltaTime;
      }
      if (movement.down) {
        newY += MOVE_SPEED * deltaTime;
      }

      // Clamp to world bounds
      const clamped = clampToWorldBounds(newX, newY, CHARACTER_SIZE);
      newX = clamped.x;
      newY = clamped.y;

      // Check collision with obstacles
      const collisionMargin = CHARACTER_SIZE * 0.4; // Smaller hitbox for better feel
      const hasCollision = checkCollision(
        newX - collisionMargin / 2,
        newY - collisionMargin / 2,
        collisionMargin,
        collisionMargin
      );

      // If collision, try sliding along walls
      if (hasCollision) {
        // Try X movement only
        const testX = clampToWorldBounds(newX, character.y, CHARACTER_SIZE);
        if (
          !checkCollision(
            testX.x - collisionMargin / 2,
            testX.y - collisionMargin / 2,
            collisionMargin,
            collisionMargin
          )
        ) {
          character.x = testX.x;
        } else {
          // Try Y movement only
          const testY = clampToWorldBounds(character.x, newY, CHARACTER_SIZE);
          if (
            !checkCollision(
              testY.x - collisionMargin / 2,
              testY.y - collisionMargin / 2,
              collisionMargin,
              collisionMargin
            )
          ) {
            character.y = testY.y;
          }
        }
      } else {
        // No collision, move freely
        character.x = newX;
        character.y = newY;
      }

      // Detect first actual movement (position change)
      if (!hasMovedRef.current) {
        const hasMoved = 
          Math.abs(character.x - previousPositionRef.current.x) > 0.1 ||
          Math.abs(character.y - previousPositionRef.current.y) > 0.1;
        
        if (hasMoved) {
          hasMovedRef.current = true;
          // Schedule modal to appear 0.2s after first movement
          firstMovementTimerRef.current = window.setTimeout(() => {
            setShowGoalsModal(true);
            firstMovementTimerRef.current = null;
          }, 200);
        }
      }

      // Smooth camera follow (Zelda-like)
      camera.x += (character.x - camera.x) * CAMERA_SMOOTHING;
      camera.y += (character.y - camera.y) * CAMERA_SMOOTHING;

      // Clamp camera to keep world bounds visible
      const halfCanvasWidth = CANVAS_WIDTH / 2;
      const halfCanvasHeight = CANVAS_HEIGHT / 2;
      camera.x = Math.max(
        WORLD_BOUNDS.minX + halfCanvasWidth,
        Math.min(WORLD_BOUNDS.maxX - halfCanvasWidth, camera.x)
      );
      camera.y = Math.max(
        WORLD_BOUNDS.minY + halfCanvasHeight,
        Math.min(WORLD_BOUNDS.maxY - halfCanvasHeight, camera.y)
      );

      // Render the frame
      render();
    },
  });

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (jokeTimeoutRef.current !== null) {
        clearTimeout(jokeTimeoutRef.current);
      }
      if (spinTimeoutRef.current !== null) {
        clearTimeout(spinTimeoutRef.current);
      }
      if (firstMovementTimerRef.current !== null) {
        clearTimeout(firstMovementTimerRef.current);
      }
    };
  }, []);

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ background: getFinalIntroGradient() }}
    >
      <div className="relative rounded-3xl overflow-hidden">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="bg-stone-900 focus:outline-none"
          tabIndex={0}
        />

        {/* Collectibles HUD */}
        <CollectiblesHud collectedCount={collectedCount} totalCount={7} />

        {/* Goals Modal */}
        {showGoalsModal && (
          <GoalsModal onDismiss={() => setShowGoalsModal(false)} />
        )}

        {currentJoke && (
          <SpeechBalloon
            text={currentJoke}
            x={jokePosition.x}
            y={jokePosition.y}
            canvasWidth={CANVAS_WIDTH}
          />
        )}

        <div className="absolute bottom-0 left-0 right-0 p-4 text-center text-stone-300 text-sm bg-gradient-to-t from-stone-900/80 to-transparent">
          <p className="font-medium">Controls:</p>
          <p className="mt-1">Arrow keys to move • Space to act • J to tell a joke</p>
        </div>
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
