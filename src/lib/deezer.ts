import type { DeezerTrack } from '@/types/track';

export const TOP_BRASIL_PLAYLIST_ID = '1111141961';

const DEEZER_API = 'https://api.deezer.com';

export async function deezerGet<T>(
  path: string,
  revalidateSeconds: number
): Promise<T | null> {
  try {
    const response = await fetch(`${DEEZER_API}${path}`, {
      next: { revalidate: revalidateSeconds }
    });
    if (!response.ok) return null;
    const body = await response.json();
    return body?.error ? null : (body as T);
  } catch {
    return null;
  }
}

export const getDeezerTrack = (id: string) =>
  deezerGet<DeezerTrack>(`/track/${id}`, 0);

export const getDeezerTrackByIsrc = (isrc: string) =>
  deezerGet<DeezerTrack>(`/track/isrc:${isrc}`, 0);

export async function searchDeezer(
  query: string,
  limit = 20
): Promise<DeezerTrack[]> {
  const result = await deezerGet<{ data: DeezerTrack[] }>(
    `/search?q=${encodeURIComponent(query)}&limit=${limit}`,
    3600
  );
  return result?.data ?? [];
}

export async function getDeezerPlaylistTracks(
  playlistId: string,
  limit = 16
): Promise<DeezerTrack[]> {
  const result = await deezerGet<{ data: DeezerTrack[] }>(
    `/playlist/${playlistId}/tracks?limit=${limit}`,
    86400
  );
  return result?.data ?? [];
}
