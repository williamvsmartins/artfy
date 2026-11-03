export async function searchItunesPreview(
  term: string
): Promise<string | null> {
  try {
    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(
        term
      )}&entity=song&limit=1&country=BR`,
      { next: { revalidate: 86400 } }
    );
    if (!response.ok) return null;
    const body = await response.json();
    return body?.results?.[0]?.previewUrl ?? null;
  } catch {
    return null;
  }
}
