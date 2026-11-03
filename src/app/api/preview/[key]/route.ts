import { getDeezerTrack, getDeezerTrackByIsrc } from '@/lib/deezer';
import { searchItunesPreview } from '@/lib/itunes';
import { parsePreviewKey } from '@/lib/params';
import {
  PREVIEW_CACHE_CONTROL,
  resolvePreviewUrl
} from '@/lib/preview/resolve-preview';

export async function GET(
  request: Request,
  { params }: { params: { key: string } }
) {
  const key = parsePreviewKey(decodeURIComponent(params.key));
  if (!key) return new Response(null, { status: 400 });

  const term = new URL(request.url).searchParams.get('q')?.slice(0, 120);
  const url = await resolvePreviewUrl(key, term || null, {
    byDeezerId: async (id) => (await getDeezerTrack(id))?.preview || null,
    byIsrc: async (isrc) => (await getDeezerTrackByIsrc(isrc))?.preview || null,
    byItunes: searchItunesPreview
  });

  if (!url) return new Response(null, { status: 404 });

  return new Response(null, {
    status: 302,
    headers: { Location: url, 'Cache-Control': PREVIEW_CACHE_CONTROL }
  });
}
