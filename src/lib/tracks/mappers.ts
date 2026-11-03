import type { DeezerTrack, SpotifyTrack, Track } from '@/types/track';

export function fromSpotify(track: SpotifyTrack): Track {
  const images = track.album.images ?? [];
  const isrc = track.external_ids?.isrc;

  return {
    id: `spotify:${track.id}`,
    name: track.name,
    artists: track.artists.map((artist) => artist.name),
    coverLarge: images[0]?.url ?? null,
    coverSmall: (images[1] ?? images[0])?.url ?? null,
    coverThumb: images[images.length - 1]?.url ?? null,
    dominantColor: null,
    previewKey: isrc ? `isrc:${isrc}` : null
  };
}

export function fromDeezer(track: DeezerTrack): Track {
  return {
    id: `deezer:${track.id}`,
    name: track.title,
    artists: [track.artist.name],
    coverLarge: track.album.cover_xl,
    coverSmall: track.album.cover_medium,
    coverThumb: track.album.cover_small,
    dominantColor: null,
    previewKey: `deezer:${track.id}`
  };
}
