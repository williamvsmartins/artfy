import { extractColors } from 'extract-colors';
import getPixels from 'get-pixels';

export const extractDominantColor = async (
  imageUrl: string
): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    getPixels(imageUrl, (err, pixels) => {
      if (err) {
        console.error('Error extracting pixels:', err);
        reject(err);
      } else {
        const data = Array.from(pixels.data);
        const width = Math.round(Math.sqrt(data.length / 4));
        const height = width;

        extractColors({ data, width, height })
          .then((colors) => {
            resolve(chooseMostSaturatedColor(colors.map((color) => color.hex)));
          })
          .catch((error) => {
            console.error('Error extracting colors:', error);
            reject(error);
          });
      }
    });
  });
};

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
