const toRgb = (hex: string) => {
  const value = parseInt(hex.replace(/^#/, ''), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
};

export function mixHex(a: string, b: string, ratio: number): string {
  const from = toRgb(a);
  const to = toRgb(b);
  return (
    '#' +
    from
      .map((channel, i) =>
        Math.round(channel * ratio + to[i] * (1 - ratio))
          .toString(16)
          .padStart(2, '0')
      )
      .join('')
  );
}
