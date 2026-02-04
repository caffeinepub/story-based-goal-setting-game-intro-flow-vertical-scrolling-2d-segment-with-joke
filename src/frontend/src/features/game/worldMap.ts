// World map definition and collision utilities for Zelda-like top-down gameplay
// Path-first generation with guaranteed traversable corridor and validation

import {
  GUARANTEED_CHANNEL_WIDTH,
  obstacleIntersectsChannel,
  validatePassability,
  type CorridorSegment,
} from './passability';

export interface WorldBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'rock' | 'tree' | 'wall';
}

export interface TileRegion {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

export interface Collectible {
  id: string;
  x: number;
  y: number;
  collected: boolean;
}

// Map unit size constant
const MAP_UNIT = 100; // Each map unit is 100 pixels
const CORRIDOR_WIDTH = 3 * MAP_UNIT; // Exactly 3 units wide (300 pixels)
const CORRIDOR_LENGTH = 50 * MAP_UNIT; // Extended downward corridor (5000 pixels = 2.5× the original 2000)

// Re-export CorridorSegment type
export type { CorridorSegment };

// Generate random 90° turn corridor path
function generateCorridorPath(): CorridorSegment[] {
  const segments: CorridorSegment[] = [];
  const minSegmentLength = 200;
  const maxSegmentLength = 400;
  
  let currentX = 150; // Start centered
  let currentY = 0;
  let currentDirection: 'horizontal' | 'vertical' = 'vertical'; // Start going down
  
  // Generate segments until we reach the target length
  while (currentY < CORRIDOR_LENGTH) {
    const segmentLength = minSegmentLength + Math.random() * (maxSegmentLength - minSegmentLength);
    
    if (currentDirection === 'vertical') {
      // Vertical segment (moving down)
      const endY = Math.min(currentY + segmentLength, CORRIDOR_LENGTH);
      segments.push({
        startX: currentX,
        startY: currentY,
        endX: currentX,
        endY: endY,
        direction: 'vertical',
      });
      currentY = endY;
      
      // Switch to horizontal for next segment (if not at end)
      if (currentY < CORRIDOR_LENGTH) {
        currentDirection = 'horizontal';
      }
    } else {
      // Horizontal segment (left or right)
      const goRight = Math.random() > 0.5;
      const horizontalDistance = minSegmentLength + Math.random() * (maxSegmentLength - minSegmentLength);
      
      // Limit horizontal movement to keep corridor within reasonable bounds
      const maxLeft = 150;
      const maxRight = 250;
      
      let endX: number;
      if (goRight) {
        endX = Math.min(currentX + horizontalDistance, maxRight);
      } else {
        endX = Math.max(currentX - horizontalDistance, maxLeft);
      }
      
      segments.push({
        startX: currentX,
        startY: currentY,
        endX: endX,
        endY: currentY,
        direction: 'horizontal',
      });
      currentX = endX;
      
      // Switch back to vertical
      currentDirection = 'vertical';
    }
  }
  
  return segments;
}

// Generate the corridor path once
const CORRIDOR_SEGMENTS: CorridorSegment[] = generateCorridorPath();

// Helper function to check if a point is inside the corridor
export function isInsideCorridor(x: number, y: number): boolean {
  const halfWidth = CORRIDOR_WIDTH / 2;
  
  for (const segment of CORRIDOR_SEGMENTS) {
    if (segment.direction === 'vertical') {
      // Vertical segment
      if (y >= segment.startY && y <= segment.endY) {
        const centerX = segment.startX;
        if (x >= centerX - halfWidth && x <= centerX + halfWidth) {
          return true;
        }
      }
    } else {
      // Horizontal segment
      const minX = Math.min(segment.startX, segment.endX);
      const maxX = Math.max(segment.startX, segment.endX);
      if (y >= segment.startY - halfWidth && y <= segment.startY + halfWidth) {
        if (x >= minX - halfWidth && x <= maxX + halfWidth) {
          return true;
        }
      }
    }
  }
  
  return false;
}

// Generate wall obstacles along corridor edges with channel-aware placement
function generateWallObstacles(): Obstacle[] {
  const walls: Obstacle[] = [];
  const wallThickness = 40;
  const halfWidth = CORRIDOR_WIDTH / 2;
  
  CORRIDOR_SEGMENTS.forEach(segment => {
    if (segment.direction === 'vertical') {
      // Vertical segment - walls on left and right
      const height = segment.endY - segment.startY;
      
      // Left wall
      const leftWall: Obstacle = {
        x: segment.startX - halfWidth - wallThickness,
        y: segment.startY,
        width: wallThickness,
        height: height,
        type: 'wall',
      };
      
      // Right wall
      const rightWall: Obstacle = {
        x: segment.startX + halfWidth,
        y: segment.startY,
        width: wallThickness,
        height: height,
        type: 'wall',
      };
      
      // Only add walls if they don't intersect the guaranteed channel
      if (!obstacleIntersectsChannel(leftWall, CORRIDOR_SEGMENTS)) {
        walls.push(leftWall);
      }
      if (!obstacleIntersectsChannel(rightWall, CORRIDOR_SEGMENTS)) {
        walls.push(rightWall);
      }
    } else {
      // Horizontal segment - walls on top and bottom
      const minX = Math.min(segment.startX, segment.endX);
      const maxX = Math.max(segment.startX, segment.endX);
      const width = maxX - minX;
      
      // Top wall
      const topWall: Obstacle = {
        x: minX - halfWidth,
        y: segment.startY - halfWidth - wallThickness,
        width: width + CORRIDOR_WIDTH,
        height: wallThickness,
        type: 'wall',
      };
      
      // Bottom wall
      const bottomWall: Obstacle = {
        x: minX - halfWidth,
        y: segment.startY + halfWidth,
        width: width + CORRIDOR_WIDTH,
        height: wallThickness,
        type: 'wall',
      };
      
      // Only add walls if they don't intersect the guaranteed channel
      if (!obstacleIntersectsChannel(topWall, CORRIDOR_SEGMENTS)) {
        walls.push(topWall);
      }
      if (!obstacleIntersectsChannel(bottomWall, CORRIDOR_SEGMENTS)) {
        walls.push(bottomWall);
      }
    }
  });
  
  // Add corner walls at turns with channel-aware placement
  for (let i = 0; i < CORRIDOR_SEGMENTS.length - 1; i++) {
    const current = CORRIDOR_SEGMENTS[i];
    const next = CORRIDOR_SEGMENTS[i + 1];
    
    // Add corner pieces at transitions
    if (current.direction === 'vertical' && next.direction === 'horizontal') {
      // Vertical to horizontal turn
      const cornerX = current.endX;
      const cornerY = current.endY;
      
      // Determine turn direction
      if (next.endX > next.startX) {
        // Turning right - fill top-left and bottom-right corners
        const topLeftCorner: Obstacle = {
          x: cornerX - halfWidth - wallThickness,
          y: cornerY - halfWidth - wallThickness,
          width: wallThickness,
          height: wallThickness,
          type: 'wall',
        };
        const bottomRightCorner: Obstacle = {
          x: cornerX + halfWidth,
          y: cornerY + halfWidth,
          width: wallThickness,
          height: wallThickness,
          type: 'wall',
        };
        
        if (!obstacleIntersectsChannel(topLeftCorner, CORRIDOR_SEGMENTS)) {
          walls.push(topLeftCorner);
        }
        if (!obstacleIntersectsChannel(bottomRightCorner, CORRIDOR_SEGMENTS)) {
          walls.push(bottomRightCorner);
        }
      } else {
        // Turning left - fill top-right and bottom-left corners
        const topRightCorner: Obstacle = {
          x: cornerX + halfWidth,
          y: cornerY - halfWidth - wallThickness,
          width: wallThickness,
          height: wallThickness,
          type: 'wall',
        };
        const bottomLeftCorner: Obstacle = {
          x: cornerX - halfWidth - wallThickness,
          y: cornerY + halfWidth,
          width: wallThickness,
          height: wallThickness,
          type: 'wall',
        };
        
        if (!obstacleIntersectsChannel(topRightCorner, CORRIDOR_SEGMENTS)) {
          walls.push(topRightCorner);
        }
        if (!obstacleIntersectsChannel(bottomLeftCorner, CORRIDOR_SEGMENTS)) {
          walls.push(bottomLeftCorner);
        }
      }
    }
  }
  
  return walls;
}

// Generate interior obstacles with guaranteed channel avoidance
function generateInteriorObstacles(): Obstacle[] {
  const obstacles: Obstacle[] = [];
  const halfWidth = CORRIDOR_WIDTH / 2;
  const halfChannelWidth = GUARANTEED_CHANNEL_WIDTH / 2;
  
  // Place obstacles along vertical segments only (easier to place)
  CORRIDOR_SEGMENTS.forEach((segment) => {
    if (segment.direction === 'vertical' && segment.endY - segment.startY > 300) {
      // Only place in longer vertical segments
      const numObstacles = Math.floor(Math.random() * 2) + 1; // 1-2 obstacles
      
      for (let i = 0; i < numObstacles; i++) {
        const y = segment.startY + (segment.endY - segment.startY) * (0.3 + Math.random() * 0.4);
        const size = 40 + Math.random() * 15;
        const type = Math.random() > 0.5 ? 'rock' : 'tree';
        
        // Calculate safe placement zones (outside the guaranteed channel)
        const leftZoneMin = segment.startX - halfWidth + size / 2;
        const leftZoneMax = segment.startX - halfChannelWidth - size / 2;
        const rightZoneMin = segment.startX + halfChannelWidth + size / 2;
        const rightZoneMax = segment.startX + halfWidth - size / 2;
        
        // Randomly choose left or right side
        let obstacleX: number;
        if (Math.random() > 0.5 && leftZoneMax > leftZoneMin) {
          // Place on left side
          obstacleX = leftZoneMin + Math.random() * (leftZoneMax - leftZoneMin);
        } else if (rightZoneMax > rightZoneMin) {
          // Place on right side
          obstacleX = rightZoneMin + Math.random() * (rightZoneMax - rightZoneMin);
        } else {
          // Skip if no valid placement zone
          continue;
        }
        
        const candidate: Obstacle = {
          x: obstacleX - size / 2,
          y: y - size / 2,
          width: size,
          height: size,
          type: type as 'rock' | 'tree',
        };
        
        // Verify the obstacle doesn't intersect the guaranteed channel
        if (!obstacleIntersectsChannel(candidate, CORRIDOR_SEGMENTS)) {
          obstacles.push(candidate);
        }
      }
    }
  });
  
  return obstacles;
}

// Generate and validate obstacles with fallback strategy
function generateValidatedObstacles(): Obstacle[] {
  const MAX_ATTEMPTS = 10;
  
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const walls = generateWallObstacles();
    const interior = generateInteriorObstacles();
    const allObstacles = [...walls, ...interior];
    
    // Validate passability
    if (validatePassability(CORRIDOR_SEGMENTS, allObstacles)) {
      return allObstacles;
    }
    
    // If validation fails, try again with fewer interior obstacles
    if (attempt > MAX_ATTEMPTS / 2) {
      // After half the attempts, use walls only as fallback
      if (validatePassability(CORRIDOR_SEGMENTS, walls)) {
        return walls;
      }
    }
  }
  
  // Ultimate fallback: walls only (should always be passable if channel logic is correct)
  return generateWallObstacles();
}

// Combine all obstacles with validation
export const OBSTACLES: Obstacle[] = generateValidatedObstacles();

// Check if a rectangle collides with any obstacle
export function checkCollision(
  x: number,
  y: number,
  width: number,
  height: number
): boolean {
  for (const obstacle of OBSTACLES) {
    if (
      x < obstacle.x + obstacle.width &&
      x + width > obstacle.x &&
      y < obstacle.y + obstacle.height &&
      y + height > obstacle.y
    ) {
      return true;
    }
  }
  return false;
}

// Get a safe spawn position at the start of the corridor with collision validation
export function getSpawnPosition(): { x: number; y: number } {
  const firstSegment = CORRIDOR_SEGMENTS[0];
  const CHARACTER_SIZE = 64;
  const collisionMargin = CHARACTER_SIZE * 0.4;
  
  // Try multiple spawn positions starting from the beginning of the corridor
  const attempts = [
    { x: firstSegment.startX, y: firstSegment.startY + 100 },
    { x: firstSegment.startX, y: firstSegment.startY + 150 },
    { x: firstSegment.startX, y: firstSegment.startY + 80 },
    { x: firstSegment.startX - 30, y: firstSegment.startY + 100 },
    { x: firstSegment.startX + 30, y: firstSegment.startY + 100 },
    { x: firstSegment.startX, y: firstSegment.startY + 200 },
  ];
  
  // Find the first valid spawn position
  for (const pos of attempts) {
    // Check if inside corridor
    if (!isInsideCorridor(pos.x, pos.y)) {
      continue;
    }
    
    // Check if collides with any obstacle
    const hasCollision = checkCollision(
      pos.x - collisionMargin / 2,
      pos.y - collisionMargin / 2,
      collisionMargin,
      collisionMargin
    );
    
    if (!hasCollision) {
      return pos;
    }
  }
  
  // Fallback to first attempt if all fail (shouldn't happen with proper corridor generation)
  return attempts[0];
}

// Calculate world bounds based on corridor segments
function calculateWorldBounds(): WorldBounds {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  
  const halfWidth = CORRIDOR_WIDTH / 2;
  
  CORRIDOR_SEGMENTS.forEach(segment => {
    if (segment.direction === 'vertical') {
      const left = segment.startX - halfWidth;
      const right = segment.startX + halfWidth;
      minX = Math.min(minX, left);
      maxX = Math.max(maxX, right);
      minY = Math.min(minY, segment.startY);
      maxY = Math.max(maxY, segment.endY);
    } else {
      const left = Math.min(segment.startX, segment.endX) - halfWidth;
      const right = Math.max(segment.startX, segment.endX) + halfWidth;
      minX = Math.min(minX, left);
      maxX = Math.max(maxX, right);
      minY = Math.min(minY, segment.startY - halfWidth);
      maxY = Math.max(maxY, segment.startY + halfWidth);
    }
  });
  
  return {
    minX: minX - 50, // Add padding for walls
    maxX: maxX + 50,
    minY: minY,
    maxY: maxY,
  };
}

export const WORLD_BOUNDS: WorldBounds = calculateWorldBounds();

// Generate tile regions for the corridor floor
function generateTileRegions(): TileRegion[] {
  const regions: TileRegion[] = [];
  const tileSize = 100;
  const halfWidth = CORRIDOR_WIDTH / 2;
  
  const colors = [
    'oklch(0.35 0.04 50)',
    'oklch(0.38 0.045 52)',
    'oklch(0.37 0.04 48)',
  ];
  
  let colorIndex = 0;
  
  // Create tiles for each segment
  CORRIDOR_SEGMENTS.forEach(segment => {
    if (segment.direction === 'vertical') {
      // Vertical segment - create tiles going down
      for (let y = segment.startY; y < segment.endY; y += tileSize) {
        const height = Math.min(tileSize, segment.endY - y);
        regions.push({
          x: segment.startX - halfWidth,
          y: y,
          width: CORRIDOR_WIDTH,
          height: height,
          color: colors[colorIndex % colors.length],
        });
        colorIndex++;
      }
    } else {
      // Horizontal segment - create tiles going horizontally
      const minX = Math.min(segment.startX, segment.endX);
      const maxX = Math.max(segment.startX, segment.endX);
      for (let x = minX; x < maxX; x += tileSize) {
        const width = Math.min(tileSize, maxX - x);
        regions.push({
          x: x - halfWidth,
          y: segment.startY - halfWidth,
          width: width + CORRIDOR_WIDTH,
          height: CORRIDOR_WIDTH,
          color: colors[colorIndex % colors.length],
        });
        colorIndex++;
      }
    }
  });
  
  return regions;
}

export const TILE_REGIONS: TileRegion[] = generateTileRegions();

// Clamp position to world bounds
export function clampToWorldBounds(
  x: number,
  y: number,
  characterSize: number
): { x: number; y: number } {
  return {
    x: Math.max(
      WORLD_BOUNDS.minX + characterSize / 2,
      Math.min(WORLD_BOUNDS.maxX - characterSize / 2, x)
    ),
    y: Math.max(
      WORLD_BOUNDS.minY + characterSize / 2,
      Math.min(WORLD_BOUNDS.maxY - characterSize / 2, y)
    ),
  };
}

// Get obstacle color based on type
export function getObstacleColor(type: Obstacle['type']): string {
  switch (type) {
    case 'rock':
      return 'oklch(0.30 0.04 45)';
    case 'tree':
      return 'oklch(0.32 0.08 130)';
    case 'wall':
      return 'oklch(0.25 0.03 40)';
  }
}

// Generate collectible positions (7 total) spread throughout the corridor
// First collectible is placed meaningfully farther from spawn
function generateCollectibles(): Collectible[] {
  const collectibles: Collectible[] = [];
  const COLLECTIBLE_SIZE = 20;
  const halfChannelWidth = GUARANTEED_CHANNEL_WIDTH / 2;
  const totalSegments = CORRIDOR_SEGMENTS.length;
  const spawnPos = getSpawnPosition();
  const MIN_FIRST_STAR_DISTANCE = 400; // Minimum downward distance from spawn for first star
  
  // Generate the first collectible with minimum distance constraint
  let firstStarPlaced = false;
  const maxAttempts = 50;
  
  for (let attempt = 0; attempt < maxAttempts && !firstStarPlaced; attempt++) {
    // Try to place first star in segments that are far enough from spawn
    for (let segIdx = 0; segIdx < totalSegments && !firstStarPlaced; segIdx++) {
      const segment = CORRIDOR_SEGMENTS[segIdx];
      
      if (segment.direction === 'vertical') {
        // Check if this segment has positions far enough from spawn
        if (segment.endY < spawnPos.y + MIN_FIRST_STAR_DISTANCE) {
          continue; // Skip segments too close to spawn
        }
        
        // Find a valid Y position that's at least MIN_FIRST_STAR_DISTANCE away
        const minY = Math.max(segment.startY, spawnPos.y + MIN_FIRST_STAR_DISTANCE);
        if (minY >= segment.endY) {
          continue; // No valid range in this segment
        }
        
        const y = minY + (segment.endY - minY) * 0.3;
        const x = segment.startX + (Math.random() - 0.5) * halfChannelWidth;
        
        // Ensure it's inside the corridor and not colliding with obstacles
        if (isInsideCorridor(x, y) && !checkCollision(x - COLLECTIBLE_SIZE / 2, y - COLLECTIBLE_SIZE / 2, COLLECTIBLE_SIZE, COLLECTIBLE_SIZE)) {
          collectibles.push({
            id: 'collectible-0',
            x,
            y,
            collected: false,
          });
          firstStarPlaced = true;
        }
      } else {
        // Horizontal segment - check if Y position is far enough
        if (segment.startY < spawnPos.y + MIN_FIRST_STAR_DISTANCE) {
          continue;
        }
        
        const minX = Math.min(segment.startX, segment.endX);
        const maxX = Math.max(segment.startX, segment.endX);
        const x = minX + (maxX - minX) * 0.5;
        const y = segment.startY + (Math.random() - 0.5) * halfChannelWidth;
        
        if (isInsideCorridor(x, y) && !checkCollision(x - COLLECTIBLE_SIZE / 2, y - COLLECTIBLE_SIZE / 2, COLLECTIBLE_SIZE, COLLECTIBLE_SIZE)) {
          collectibles.push({
            id: 'collectible-0',
            x,
            y,
            collected: false,
          });
          firstStarPlaced = true;
        }
      }
    }
  }
  
  // If we still couldn't place the first star, use a fallback position
  if (!firstStarPlaced) {
    const fallbackSegment = CORRIDOR_SEGMENTS[Math.min(2, totalSegments - 1)];
    if (fallbackSegment.direction === 'vertical') {
      collectibles.push({
        id: 'collectible-0',
        x: fallbackSegment.startX,
        y: Math.max(fallbackSegment.startY, spawnPos.y + MIN_FIRST_STAR_DISTANCE),
        collected: false,
      });
    } else {
      collectibles.push({
        id: 'collectible-0',
        x: (fallbackSegment.startX + fallbackSegment.endX) / 2,
        y: fallbackSegment.startY,
        collected: false,
      });
    }
  }
  
  // Generate remaining 6 collectibles distributed across the corridor
  for (let i = 1; i < 7; i++) {
    // Select a segment (spread them out)
    const segmentIndex = Math.floor((i / 7) * totalSegments);
    const segment = CORRIDOR_SEGMENTS[Math.min(segmentIndex, totalSegments - 1)];
    
    let x: number;
    let y: number;
    
    if (segment.direction === 'vertical') {
      // Place in the center channel of vertical segments
      const progress = (i % 3) / 3; // Vary position within segment
      x = segment.startX + (Math.random() - 0.5) * halfChannelWidth;
      y = segment.startY + (segment.endY - segment.startY) * (0.2 + progress * 0.6);
    } else {
      // Place in the center channel of horizontal segments
      const minX = Math.min(segment.startX, segment.endX);
      const maxX = Math.max(segment.startX, segment.endX);
      const progress = (i % 3) / 3;
      x = minX + (maxX - minX) * (0.2 + progress * 0.6);
      y = segment.startY + (Math.random() - 0.5) * halfChannelWidth;
    }
    
    // Ensure it's inside the corridor and not colliding with obstacles
    if (isInsideCorridor(x, y) && !checkCollision(x - COLLECTIBLE_SIZE / 2, y - COLLECTIBLE_SIZE / 2, COLLECTIBLE_SIZE, COLLECTIBLE_SIZE)) {
      collectibles.push({
        id: `collectible-${i}`,
        x,
        y,
        collected: false,
      });
    }
  }
  
  // If we didn't get 7 valid positions, fill in with simpler placement
  while (collectibles.length < 7) {
    const segmentIndex = Math.floor(Math.random() * totalSegments);
    const segment = CORRIDOR_SEGMENTS[segmentIndex];
    
    let x: number;
    let y: number;
    
    if (segment.direction === 'vertical') {
      x = segment.startX;
      y = segment.startY + (segment.endY - segment.startY) * Math.random();
    } else {
      const minX = Math.min(segment.startX, segment.endX);
      const maxX = Math.max(segment.startX, segment.endX);
      x = minX + (maxX - minX) * Math.random();
      y = segment.startY;
    }
    
    if (isInsideCorridor(x, y)) {
      collectibles.push({
        id: `collectible-fallback-${collectibles.length}`,
        x,
        y,
        collected: false,
      });
    }
  }
  
  return collectibles;
}

export function getCollectibles(): Collectible[] {
  return generateCollectibles();
}
