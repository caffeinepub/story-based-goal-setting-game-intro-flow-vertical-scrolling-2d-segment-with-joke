export function getBackgroundGradient(currentDarkeningIndex: number, totalDarkeningSteps: number): string {
  if (currentDarkeningIndex === 0) {
    // Initial soft, fun gradient
    return 'linear-gradient(135deg, oklch(0.95 0.05 120) 0%, oklch(0.92 0.08 180) 50%, oklch(0.90 0.06 240) 100%)';
  }

  // Calculate progression (0 to 1)
  const progress = Math.min(currentDarkeningIndex / totalDarkeningSteps, 1);

  // Interpolate from light to dark/gloomy
  const lightness1 = 0.95 - progress * 0.50; // 0.95 -> 0.45
  const lightness2 = 0.92 - progress * 0.52; // 0.92 -> 0.40
  const lightness3 = 0.90 - progress * 0.50; // 0.90 -> 0.40

  const chroma1 = 0.05 + progress * 0.03; // Slight increase in saturation
  const chroma2 = 0.08 + progress * 0.04;
  const chroma3 = 0.06 + progress * 0.03;

  // Shift hues toward cooler, gloomier tones
  const hue1 = 120 - progress * 80; // 120 -> 40 (green to brown/orange)
  const hue2 = 180 - progress * 100; // 180 -> 80 (cyan to brown)
  const hue3 = 240 - progress * 120; // 240 -> 120 (blue to green-brown)

  return `linear-gradient(135deg, oklch(${lightness1} ${chroma1} ${hue1}) 0%, oklch(${lightness2} ${chroma2} ${hue2}) 50%, oklch(${lightness3} ${chroma3} ${hue3}) 100%)`;
}
