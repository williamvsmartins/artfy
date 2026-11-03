import { unstable_cache } from 'next/cache';

import {
  TOP_BRASIL_PLAYLIST_ID,
  getDeezerPlaylistTracks,
  getDeezerTrack
} from '@/lib/deezer';
import { fromDeezer } from '@/lib/tracks/mappers';
import { withDominantColors } from '@/lib/tracks/with-dominant-colors';
import type { Track } from '@/types/track';

const ONE_DAY = 86400;

const loadChart = unstable_cache(
  async () => {
    const tracks = await getDeezerPlaylistTracks(TOP_BRASIL_PLAYLIST_ID, 16);
    if (tracks.length === 0) throw new Error('chart vazio');
    return withDominantColors(tracks.map(fromDeezer));
  },
  ['chart-brasil'],
  { revalidate: ONE_DAY }
);

export async function getChartTracks(): Promise<Track[] | null> {
  try {
    return await loadChart();
  } catch {
    return null;
  }
}

const loadTrack = (id: string) =>
  unstable_cache(
    async () => {
      const track = await getDeezerTrack(id);
      if (!track) return null;
      const [withColor] = await withDominantColors([fromDeezer(track)]);
      return withColor;
    },
    ['deezer-track', id],
    { revalidate: ONE_DAY }
  )();

export async function getTracksByIds(ids: string[]): Promise<Track[]> {
  const tracks = await Promise.all(ids.map(loadTrack));
  return tracks.filter((track): track is Track => track !== null);
}
