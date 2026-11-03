import { extractDominantColor } from '@/lib/extractDominantColor';
import type { Track } from '@/types/track';

export async function withDominantColors(tracks: Track[]): Promise<Track[]> {
  const colors = await Promise.allSettled(
    tracks.map((track) =>
      track.coverThumb
        ? extractDominantColor(track.coverThumb)
        : Promise.reject(new Error('no cover'))
    )
  );

  return tracks.map((track, i) => {
    const color = colors[i];
    return {
      ...track,
      dominantColor: color.status === 'fulfilled' ? color.value : null
    };
  });
}
