import type { PreviewKey } from '@/lib/params';

export const PREVIEW_CACHE_CONTROL = 'public, s-maxage=300';

type PreviewSources = {
  byDeezerId(id: string): Promise<string | null>;
  byIsrc(isrc: string): Promise<string | null>;
  byItunes(term: string): Promise<string | null>;
};

export async function resolvePreviewUrl(
  key: PreviewKey,
  fallbackTerm: string | null,
  sources: PreviewSources
): Promise<string | null> {
  const fromDeezer =
    key.source === 'deezer'
      ? await sources.byDeezerId(key.id)
      : await sources.byIsrc(key.isrc);

  if (fromDeezer) return fromDeezer;
  if (!fallbackTerm) return null;
  return sources.byItunes(fallbackTerm);
}
