import type { Track } from '@/types/track';

export const HOVER_INTENT_MS = 150;
export const HOLD_MS = 250;
export const HOLD_MOVE_TOLERANCE_PX = 10;
export const CROSSFADE_MS = 450;
export const SWITCH_INTENT_MS = 60;
export const LEAVE_GRACE_MS = 250;
export const PREFETCH_CONCURRENCY = 3;
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

export function hoverDelay(somethingPlaying: boolean): number {
  return somethingPlaying ? SWITCH_INTENT_MS : HOVER_INTENT_MS;
}

export function pendingSources(
  sources: (string | null)[],
  known: Set<string>
): string[] {
  return Array.from(
    new Set(sources.filter((src): src is string => !!src && !known.has(src)))
  );
}
