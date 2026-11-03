import type { Track } from '@/types/track';

export const HOVER_INTENT_MS = 150;
export const HOLD_MS = 250;
export const HOLD_MOVE_TOLERANCE_PX = 10;
export const CROSSFADE_MS = 300;
export const SOUND_STORAGE_KEY = 'artfy:sound';

export function fadeVolume(
  elapsedMs: number,
  durationMs: number,
  from: number,
  to: number
): number {
  const progress = Math.min(Math.max(elapsedMs / durationMs, 0), 1);
  return from + (to - from) * progress;
}

export function isHoldCancelled(dx: number, dy: number): boolean {
  return Math.hypot(dx, dy) > HOLD_MOVE_TOLERANCE_PX;
}

export function previewSrc(
  track: Pick<Track, 'previewKey' | 'artists' | 'name'>
): string | null {
  if (!track.previewKey) return null;
  const term = [...track.artists, track.name].join(' ');
  return `/api/preview/${track.previewKey}?q=${encodeURIComponent(term)}`;
}
