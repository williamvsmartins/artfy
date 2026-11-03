export const STORY_W = 1080;
export const STORY_H = 1920;
export const SAFE_TOP = Math.round(STORY_H * 0.16);

const GRID_LEFT = 90;
const GRID_TOP = SAFE_TOP + 60;
const CELL_W = 300;
const CELL_H = 330;
const SIZE = 250;
const HERO_SIZE = 300;
const MAX_SLOTS = 9;

const CELLS: [number, number][] = [
  [1, 1],
  [0, 0],
  [0, 1],
  [0, 2],
  [1, 0],
  [1, 2],
  [2, 0],
  [2, 1],
  [2, 2]
];
const ROTATION = [-2, -6, 4, -3, 7, -8, 3, -5, 6];
const Z = [9, 1, 2, 1, 2, 1, 2, 1, 2];

export type PolaroidSlot = {
  x: number;
  y: number;
  size: number;
  rotate: number;
  z: number;
};

export function polaroidLayout(count: number): PolaroidSlot[] {
  return CELLS.slice(0, Math.max(0, Math.min(count, MAX_SLOTS))).map(
    ([row, col], i) => {
      const size = i === 0 ? HERO_SIZE : SIZE;
      return {
        x: GRID_LEFT + col * CELL_W + (CELL_W - size) / 2,
        y: GRID_TOP + row * CELL_H + (CELL_H - size) / 2,
        size,
        rotate: ROTATION[i],
        z: Z[i]
      };
    }
  );
}

export function truncate(text: string, max: number): string {
  const chars = Array.from(text);
  if (chars.length <= max) return text;
  return chars.slice(0, max - 1).join('') + '…';
}

export const TITLE_MAX_WIDTH = 940;
const TITLE_MAX_FONT = 120;

const charWidth = (char: string) => {
  if (/[MW]/.test(char)) return 1.05;
  if (/[\sIJ1.,'!]/.test(char)) return 0.35;
  return 0.72;
};

export function titleFontSize(title: string): number {
  const ems = Array.from(title).reduce((sum, char) => sum + charWidth(char), 0);
  return Math.min(
    TITLE_MAX_FONT,
    Math.floor(TITLE_MAX_WIDTH / Math.max(ems, 1))
  );
}
