export function getBackgroundGradient(currentDarkeningIndex: number, totalDarkeningSteps: number): string {
  if (currentDarkeningIndex === 0) {
    // Initial darker purplish gradient
    return 'linear-gradient(135deg, oklch(0.50 0.12 280) 0%, oklch(0.45 0.14 290) 50%, oklch(0.48 0.12 270) 100%)';
  }

  // Calculate progression (0 to 1)
  const progress = Math.min(currentDarkeningIndex / totalDarkeningSteps, 1);

  // Interpolate from darker purple to very dark purple/brown with brown tones as it darkens
  const lightness1 = 0.50 - progress * 0.28; // 0.50 -> 0.22
  const lightness2 = 0.45 - progress * 0.25; // 0.45 -> 0.20
  const lightness3 = 0.48 - progress * 0.26; // 0.48 -> 0.22

  const chroma1 = 0.12 + progress * 0.03; // Slight increase in saturation
  const chroma2 = 0.14 + progress * 0.04;
  const chroma3 = 0.12 + progress * 0.03;

  // Keep hues in purple-to-brown-purple range (no blue drift)
  // Shift toward warmer purple-brown as it darkens
  const hue1 = 280 - progress * 30; // 280 -> 250 (purple to warm purple-brown)
  const hue2 = 290 - progress * 40; // 290 -> 250 (purple to warm purple-brown)
  const hue3 = 270 - progress * 20; // 270 -> 250 (purple to warm purple-brown)

  return `linear-gradient(135deg, oklch(${lightness1} ${chroma1} ${hue1}) 0%, oklch(${lightness2} ${chroma2} ${hue2}) 50%, oklch(${lightness3} ${chroma3} ${hue3}) 100%)`;
}

// Export the initial landing page gradient for reuse
export function getInitialIntroGradient(): string {
  return 'linear-gradient(135deg, oklch(0.50 0.12 280) 0%, oklch(0.45 0.14 290) 50%, oklch(0.48 0.12 270) 100%)';
}

// Export the final darkened gradient for use in game view
export function getFinalIntroGradient(): string {
  // This represents the fully darkened terminal gradient (progress = 1) with brown tones
  return 'linear-gradient(135deg, oklch(0.22 0.15 250) 0%, oklch(0.20 0.18 250) 50%, oklch(0.22 0.15 250) 100%)';
}

// Export the total number of darkening steps for outro lightening
export const TOTAL_INTRO_DARKENING_STEPS = 9; // 8 from goalsBlockA/B + 1 from sliderQuestion
