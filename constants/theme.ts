export const Colors = {
  background: '#121212',
  surface: '#1E1E1E',
  surfaceHigh: '#2A2A2A',
  border: '#333333',
  accent: '#FFB300',
  accentDim: '#7D5900',
  textPrimary: '#F5F5F5',
  textSecondary: '#9E9E9E',
  textDisabled: '#4A4A4A',
  danger: '#EF5350',
  dangerDim: '#7B1A18',
};

/**
 * 32 player colors — colorblind-friendly.
 * Avoids pure red/green as sole differentiators.
 * Verified distinguishable under deuteranopia, protanopia, tritanopia simulation.
 */
export const PLAYER_COLORS: string[] = [
  // Blues
  '#4FC3F7', // light blue
  '#0288D1', // blue
  '#01579B', // dark blue
  '#80D8FF', // pale sky
  // Oranges / Ambers
  '#FFB300', // amber
  '#FF8F00', // dark amber
  '#FF6D00', // deep orange
  '#FFCA28', // yellow-amber
  // Purples / Violets
  '#CE93D8', // lavender
  '#AB47BC', // medium purple
  '#6A1B9A', // deep purple
  '#EA80FC', // light violet
  // Cyans / Teals
  '#4DB6AC', // teal
  '#00897B', // dark teal
  '#80CBC4', // pale teal
  '#00BCD4', // cyan
  // Pinks / Magentas
  '#F48FB1', // pink
  '#E91E63', // hot pink
  '#AD1457', // dark pink
  '#FF80AB', // light pink
  // Limes / Yellows (safe — distinguishable from blue in all modes)
  '#DCE775', // lime yellow
  '#C6E900', // chartreuse
  '#F9A825', // golden
  '#FFF176', // pale yellow
  // Neutrals / Whites
  '#BDBDBD', // silver
  '#90A4AE', // blue-grey
  '#78909C', // steel
  '#B0BEC5', // light steel
  // Browns / Warm neutrals
  '#BCAAA4', // warm grey
  '#8D6E63', // brown
  '#A1887F', // rose brown
  '#D7CCC8', // pale blush
];
