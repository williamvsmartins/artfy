import { DefaultSession } from 'next-auth';

import { AxiosError } from 'axios';

type MyUserProps = {
  name?: string | null;
  email?: string | null;
  picture?: string | null;
  image?: string | null;
  accessToken?: string | null;
};

export interface MySessionProps extends Omit<DefaultSession, 'user'> {
  user?: MyUserProps;
  expires: string;
}

export type ImageProps = {
  height: number | null;
  url: string | null;
  width: number | null;
};

export type ArtistProps = {
  id: string;
  name: string;
  images?: [ImageProps];
  followers?: {
    total: number;
  };
  genres?: [string];
};

export type AlbumProps = {
  id: string;
  name: string;
  artists: [AlbumProps];
  images?: [ImageProps];
  album_type?: string;
  release_date?: string;
  tracks?: {
    total: number;
    items: TrackProps[];
  };
};

export type TrackProps = {
  id: string;
  name: string;
  album: AlbumProps;
  artists: [AlbumProps];
  duration_ms: number;
  preview_url: string;
};

export type ReturnTrackProps = {
  items: TrackProps[];
};

export type ErrorProps = {
  data: {
    error: string;
  };
  status: number;
} & AxiosError;
