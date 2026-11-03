import type { Period } from '@/lib/params';
import { fromSpotify } from '@/lib/tracks/mappers';
import { withDominantColors } from '@/lib/tracks/with-dominant-colors';
import type { SpotifyTrack, Track } from '@/types/track';

export class SpotifyApiError extends Error {
  constructor(public status: number) {
    super(`Spotify API respondeu ${status}`);
  }
}

export async function getTopTracks(
  period: Period,
  accessToken: string
): Promise<Track[]> {
  const response = await fetch(
    `https://api.spotify.com/v1/me/top/tracks?time_range=${period}&limit=16`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store'
    }
  );
  if (!response.ok) throw new SpotifyApiError(response.status);

  const body: { items: SpotifyTrack[] } = await response.json();
  return withDominantColors(body.items.map(fromSpotify));
}
