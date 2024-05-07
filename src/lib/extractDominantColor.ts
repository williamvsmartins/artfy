import { extractColors } from 'extract-colors';
import Jimp from 'jimp';

export const extractDominantColors = async (
  imageUrls: string[]
): Promise<string[]> => {
  const promises = imageUrls.map((imageUrl) => {
    return new Promise<string>((resolve, reject) => {
      Jimp.read(imageUrl)
        .then((image) => {
          image.resize(100, Jimp.AUTO);
          const { data, width, height } = image.bitmap;
          const pixels = Array.from(data);
          extractColors({ data: pixels, width, height })
            .then((colors) => {
              resolve(
                chooseMostSaturatedColor(colors.map((color) => color.hex))
              );
            })
            .catch((error) => {
              reject(error);
            });
        })
        .catch((err) => {
          reject(err);
        });
    });
  });

  return Promise.all(promises);
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
