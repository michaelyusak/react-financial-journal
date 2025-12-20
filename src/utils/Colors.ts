const PIE_PALETTE = [
  "#1B3C53", // blue primary
  "#234C6A", // blue secondary
  "#3BAEA0", // teal accent
  "#4CAF8D", // success green
  "#E6A23C", // warning amber
  "#D9534F", // danger red
  "#456882", // muted blue
];

function lighten(hex: string, amount: number) {
  const num = parseInt(hex.replace("#", ""), 16);

  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0xff) + amount));

  return `rgb(${r}, ${g}, ${b})`;
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function GeneratePieColors(
  count: number
): { base: string[]; hover: string[] } {
  const base: string[] = [];
  const hover: string[] = [];

  for (let i = 0; i < count; i++) {
    const paletteIndex = i % PIE_PALETTE.length;
    const repetition = Math.floor(i / PIE_PALETTE.length);

    const baseColor = PIE_PALETTE[paletteIndex];

    // controlled randomness (±4)
    const randomNudge = randomInt(-4, 4);

    // repetition keeps them distinguishable
    const lightnessDelta = repetition * 6 + randomNudge;

    const adjustedBase = lighten(baseColor, lightnessDelta);
    const adjustedHover = lighten(baseColor, lightnessDelta + 10);

    base.push(adjustedBase);
    hover.push(adjustedHover);
  }

  return { base, hover };
}
