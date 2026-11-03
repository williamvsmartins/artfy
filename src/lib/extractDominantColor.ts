import { extractColors } from 'extract-colors';
import Jimp from 'jimp';

export async function extractDominantColor(imageUrl: string): Promise<string> {
  const image = await Jimp.read(imageUrl);
  const { data, width, height } = image.bitmap;
  const colors = await extractColors({ data: Array.from(data), width, height });
  return chooseMostSaturatedColor(colors.map((color) => color.hex));
}

const hexToRgb = (hex: string) => {
  hex = hex.replace(/^#/, '');

  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return { r, g, b };
};

const calculateSaturation = (color: string) => {
  const rgb = hexToRgb(color);

  const max = Math.max(rgb.r, rgb.g, rgb.b);
  const min = Math.min(rgb.r, rgb.g, rgb.b);

  const delta = max - min;
  let saturation = 0;
  if (max !== 0) {
    saturation = delta / max;
  }

  return saturation;
};

const chooseMostSaturatedColor = (albumColors: string[]) => {
  let mostSaturatedColor = '';
  let maxSaturation = -1;

  for (const color of albumColors) {
    const saturation = calculateSaturation(color);
    if (saturation > maxSaturation) {
      maxSaturation = saturation;
      mostSaturatedColor = color;
    }
  }

  return mostSaturatedColor;
};
