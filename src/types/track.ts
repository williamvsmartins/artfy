export type Track = {
  id: string;
  name: string;
  artists: string[];
  coverSmall: string | null;
  coverLarge: string | null;
  coverThumb: string | null;
  dominantColor: string | null;
  previewKey: string | null;
};

export type SpotifyTrack = {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { images?: { url: string }[] };
  external_ids?: { isrc?: string };
};

export type DeezerTrack = {
  id: number;
  title: string;
  artist: { name: string };
  album: { cover_small: string; cover_medium: string; cover_xl: string };
  preview: string;
  isrc?: string;
};
