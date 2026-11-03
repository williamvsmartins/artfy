import { getServerSession } from 'next-auth';
import { ImageResponse } from 'next/og';

import { authConfig } from '@/lib/auth';
import { PERIOD_TITLE, parseShareParams } from '@/lib/params';
import { loadFont } from '@/lib/share/load-font';
import { STORY_H, STORY_W } from '@/lib/share/polaroid-layout';
import { PolaroidStory } from '@/lib/share/PolaroidStory';
import { siteHost, siteUrl } from '@/lib/site-url';
import { SpotifyApiError, getTopTracks } from '@/lib/spotify';
import { getChartTracks, getTracksByIds } from '@/lib/tracks/catalog';
import type { Track } from '@/types/track';
import QRCode from 'qrcode';

export const runtime = 'nodejs';

const PUBLIC_CACHE = 'public, s-maxage=86400';
const PRIVATE_CACHE = 'private, no-store';

async function loadStory(
  searchParams: URLSearchParams
): Promise<
  { title: string; tracks: Track[]; cache: string } | { status: number }
> {
  const request = parseShareParams(searchParams);
  if (!request) return { status: 400 };

  if (request.kind === 'chart') {
    const tracks = await getChartTracks();
    if (!tracks) return { status: 503 };
    return { title: 'O BRASIL AGORA', tracks, cache: PUBLIC_CACHE };
  }

  if (request.kind === 'custom') {
    const tracks = await getTracksByIds(request.ids);
    return { title: request.title, tracks, cache: PUBLIC_CACHE };
  }

  const session = await getServerSession(authConfig);
  const accessToken = session?.user?.accessToken;
  if (!accessToken) return { status: 401 };

  try {
    const tracks = await getTopTracks(request.period, accessToken);
    return {
      title: PERIOD_TITLE[request.period],
      tracks,
      cache: PRIVATE_CACHE
    };
  } catch (error) {
    if (error instanceof SpotifyApiError) return { status: error.status };
    throw error;
  }
}

export async function GET(request: Request) {
  const story = await loadStory(new URL(request.url).searchParams);
  if ('status' in story) return new Response(null, { status: story.status });

  const [qrDataUrl, font] = await Promise.all([
    QRCode.toDataURL(siteUrl(), {
      margin: 1,
      width: 340,
      color: { dark: '#000000', light: '#FFE818' }
    }),
    loadFont()
  ]);

  return new ImageResponse(
    (
      <PolaroidStory
        title={story.title}
        tracks={story.tracks}
        qrDataUrl={qrDataUrl}
        host={siteHost()}
      />
    ),
    {
      width: STORY_W,
      height: STORY_H,
      fonts: font
        ? [{ name: 'Inter', data: font, weight: 800, style: 'normal' }]
        : undefined,
      headers: { 'Cache-Control': story.cache }
    }
  );
}
