// Passability validation and guaranteed traversable channel utilities
// Ensures the corridor is always passable by the character's collision hitbox

import type { Obstacle } from './worldMap';

// Character collision dimensions (must match GameView.tsx)
const CHARACTER_SIZE = 64;
const COLLISION_MARGIN = CHARACTER_SIZE * 0.4;
const SAFETY_BUFFER = 10; // Extra buffer for guaranteed clearance

// Minimum guaranteed channel width (hitbox + safety buffer on each side)
export const GUARANTEED_CHANNEL_WIDTH = COLLISION_MARGIN + SAFETY_BUFFER * 2;

// Corridor segment interface (matches worldMap.ts)
export interface CorridorSegment {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  direction: 'horizontal' | 'vertical';
}

// Axis-aligned bounding box for channel geometry
interface AABB {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

/**
 * Calculate the guaranteed traversable channel for a corridor segment
 * Returns an AABB representing the safe zone that must remain obstacle-free
 */
export function getSegmentChannel(segment: CorridorSegment): AABB {
  const halfChannel = GUARANTEED_CHANNEL_WIDTH / 2;

  if (segment.direction === 'vertical') {
    return {
      minX: segment.startX - halfChannel,
      maxX: segment.startX + halfChannel,
      minY: segment.startY,
      maxY: segment.endY,
    };
  } else {
    // Horizontal segment
    const minX = Math.min(segment.startX, segment.endX);
    const maxX = Math.max(segment.startX, segment.endX);
    return {
      minX: minX,
      maxX: maxX,
      minY: segment.startY - halfChannel,
      maxY: segment.startY + halfChannel,
    };
  }
}

/**
 * Calculate the junction channel that bridges two connecting segments
 * Ensures continuity at turns by creating a union region
 */
export function getJunctionChannel(
  current: CorridorSegment,
  next: CorridorSegment
): AABB | null {
  // Only create junction for actual transitions
  if (current.direction === next.direction) {
    return null;
  }

  const halfChannel = GUARANTEED_CHANNEL_WIDTH / 2;

  if (current.direction === 'vertical' && next.direction === 'horizontal') {
    // Vertical to horizontal turn
    const cornerX = current.endX;
    const cornerY = current.endY;

    return {
      minX: Math.min(cornerX, next.endX) - halfChannel,
      maxX: Math.max(cornerX, next.endX) + halfChannel,
      minY: cornerY - halfChannel,
      maxY: cornerY + halfChannel,
    };
  } else if (current.direction === 'horizontal' && next.direction === 'vertical') {
    // Horizontal to vertical turn
    const cornerX = next.startX;
    const cornerY = current.startY;

    return {
      minX: cornerX - halfChannel,
      maxX: cornerX + halfChannel,
      minY: Math.min(cornerY, next.endY) - halfChannel,
      maxY: Math.max(cornerY, next.endY) + halfChannel,
    };
  }

  return null;
}

/**
 * Check if an obstacle intersects with any guaranteed channel
 */
export function obstacleIntersectsChannel(
  obstacle: Obstacle,
  segments: CorridorSegment[]
): boolean {
  const obstacleAABB: AABB = {
    minX: obstacle.x,
    maxX: obstacle.x + obstacle.width,
    minY: obstacle.y,
    maxY: obstacle.y + obstacle.height,
  };

  // Check intersection with all segment channels
  for (const segment of segments) {
    const channel = getSegmentChannel(segment);
    if (aabbIntersects(obstacleAABB, channel)) {
      return true;
    }
  }

  // Check intersection with all junction channels
  for (let i = 0; i < segments.length - 1; i++) {
    const junction = getJunctionChannel(segments[i], segments[i + 1]);
    if (junction && aabbIntersects(obstacleAABB, junction)) {
      return true;
    }
  }

  return false;
}

/**
 * Check if two AABBs intersect
 */
function aabbIntersects(a: AABB, b: AABB): boolean {
  return !(a.maxX <= b.minX || a.minX >= b.maxX || a.maxY <= b.minY || a.minY >= b.maxY);
}

/**
 * Validate that the corridor is passable using a grid-based pathfinding approach
 * Returns true if a continuous path exists from start to end
 */
export function validatePassability(
  segments: CorridorSegment[],
  obstacles: Obstacle[]
): boolean {
  if (segments.length === 0) return false;

  // Define start and end positions
  const startSegment = segments[0];
  const endSegment = segments[segments.length - 1];

  const startX = startSegment.startX;
  const startY = startSegment.startY + 50; // Slightly below spawn

  const endX = endSegment.direction === 'vertical' ? endSegment.endX : endSegment.endX;
  const endY = endSegment.direction === 'vertical' ? endSegment.endY - 50 : endSegment.endY;

  // Use a grid-based approach with cells sized to the collision hitbox
  const cellSize = COLLISION_MARGIN;
  const gridMinX = Math.min(...segments.map(s => Math.min(s.startX, s.endX))) - 200;
  const gridMaxX = Math.max(...segments.map(s => Math.max(s.startX, s.endX))) + 200;
  const gridMinY = Math.min(...segments.map(s => Math.min(s.startY, s.endY)));
  const gridMaxY = Math.max(...segments.map(s => Math.max(s.startY, s.endY)));

  const gridWidth = Math.ceil((gridMaxX - gridMinX) / cellSize);
  const gridHeight = Math.ceil((gridMaxY - gridMinY) / cellSize);

  // Convert world position to grid coordinates
  const toGridX = (x: number) => Math.floor((x - gridMinX) / cellSize);
  const toGridY = (y: number) => Math.floor((y - gridMinY) / cellSize);

  const startGridX = toGridX(startX);
  const startGridY = toGridY(startY);
  const endGridX = toGridX(endX);
  const endGridY = toGridY(endY);

  // BFS to find path
  const visited = new Set<string>();
  const queue: Array<{ x: number; y: number }> = [{ x: startGridX, y: startGridY }];
  visited.add(`${startGridX},${startGridY}`);

  // Helper to check if a grid cell is walkable
  const isWalkable = (gx: number, gy: number): boolean => {
    if (gx < 0 || gx >= gridWidth || gy < 0 || gy >= gridHeight) {
      return false;
    }

    // Convert grid position back to world position (center of cell)
    const worldX = gridMinX + gx * cellSize + cellSize / 2;
    const worldY = gridMinY + gy * cellSize + cellSize / 2;

    // Check if this position would collide with any obstacle
    const halfMargin = COLLISION_MARGIN / 2;
    for (const obstacle of obstacles) {
      if (
        worldX - halfMargin < obstacle.x + obstacle.width &&
        worldX + halfMargin > obstacle.x &&
        worldY - halfMargin < obstacle.y + obstacle.height &&
        worldY + halfMargin > obstacle.y
      ) {
        return false;
      }
    }

    return true;
  };

  // BFS search
  while (queue.length > 0) {
    const current = queue.shift()!;

    // Check if we reached the end
    if (Math.abs(current.x - endGridX) <= 1 && Math.abs(current.y - endGridY) <= 1) {
      return true;
    }

    // Explore 8 directions (including diagonals for smoother paths)
    const directions = [
      { dx: -1, dy: 0 },
      { dx: 1, dy: 0 },
      { dx: 0, dy: -1 },
      { dx: 0, dy: 1 },
      { dx: -1, dy: -1 },
      { dx: 1, dy: -1 },
      { dx: -1, dy: 1 },
      { dx: 1, dy: 1 },
    ];

    for (const dir of directions) {
      const nx = current.x + dir.dx;
      const ny = current.y + dir.dy;
      const key = `${nx},${ny}`;

      if (!visited.has(key) && isWalkable(nx, ny)) {
        visited.add(key);
        queue.push({ x: nx, y: ny });
      }
    }
  }

  return false;
}
