let cached: Promise<ArrayBuffer | null> | null = null;

async function fetchInterBold(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      'https://fonts.googleapis.com/css2?family=Inter:wght@800'
    ).then((response) => response.text());
    const url = css.match(
      /src: url\((.+?)\) format\('(?:opentype|truetype)'\)/
    )?.[1];
    if (!url) return null;
    return await fetch(url).then((response) => response.arrayBuffer());
  } catch {
    return null;
  }
}

export function loadFont(): Promise<ArrayBuffer | null> {
  cached ??= fetchInterBold().then((font) => {
    if (!font) cached = null;
    return font;
  });
  return cached;
}
