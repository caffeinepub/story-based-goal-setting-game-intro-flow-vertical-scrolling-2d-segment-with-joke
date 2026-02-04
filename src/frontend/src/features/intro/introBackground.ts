export function getBackgroundGradient(currentDarkeningIndex: number, totalDarkeningSteps: number): string {
  if (currentDarkeningIndex === 0) {
    // Initial soft, fun gradient
    return 'linear-gradient(135deg, oklch(0.95 0.05 120) 0%, oklch(0.92 0.08 180) 50%, oklch(0.90 0.06 240) 100%)';
  }

  // Calculate progression (0 to 1)
  const progress = Math.min(currentDarkeningIndex / totalDarkeningSteps, 1);

  // Interpolate from light to dark/gloomy with colder hues
  const lightness1 = 0.95 - progress * 0.55; // 0.95 -> 0.40
  const lightness2 = 0.92 - progress * 0.57; // 0.92 -> 0.35
  const lightness3 = 0.90 - progress * 0.55; // 0.90 -> 0.35

  const chroma1 = 0.05 + progress * 0.04; // Slight increase in saturation
  const chroma2 = 0.08 + progress * 0.05;
  const chroma3 = 0.06 + progress * 0.04;

  // Shift hues toward colder, gloomier tones (blues, steel, icy)
  const hue1 = 120 + progress * 100; // 120 -> 220 (green to blue)
  const hue2 = 180 + progress * 60; // 180 -> 240 (cyan to blue)
  const hue3 = 240 + progress * 20; // 240 -> 260 (blue to violet-blue)

  return `linear-gradient(135deg, oklch(${lightness1} ${chroma1} ${hue1}) 0%, oklch(${lightness2} ${chroma2} ${hue2}) 50%, oklch(${lightness3} ${chroma3} ${hue3}) 100%)`;
}

// Export the final darkened gradient for use in game view
export function getFinalIntroGradient(): string {
  // This represents the fully darkened terminal gradient (progress = 1)
  return 'linear-gradient(135deg, oklch(0.40 0.09 220) 0%, oklch(0.35 0.13 240) 50%, oklch(0.35 0.10 260) 100%)';
}
