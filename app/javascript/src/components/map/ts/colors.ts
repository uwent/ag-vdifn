const errColor = '#808080';

const viridis = [
  '#440154',
  '#481567',
  '#482677',
  '#453781',
  '#404788',
  '#39568C',
  '#33638D',
  '#2D708E',
  '#287D8E',
  '#238A8D',
  '#1F968B',
  '#20A387',
  '#29AF7F',
  '#3CBB75',
  '#55C667',
  '#73D055',
  '#95D840',
  '#B8DE29',
  '#DCE319',
  '#FDE725',
];

const viridisPalette = {
  low: viridis[0],
  lowMed: viridis[4],
  med: viridis[9],
  medHigh: viridis[14],
  high: viridis[19],
  grey: errColor,
};

const classicPalette = {
  low: '#00cc00',
  lowMed: '#7dff23',
  med: '#ffd700',
  medHigh: '#ff8000',
  high: '#cc0000',
  grey: errColor,
};

export const COLORS = classicPalette;
// export const COLORS = viridisPalette;
