'use client';
import { memo } from 'react';

import { useIsPlaying } from '@/components/AudioPreview/AudioPreviewProvider';
import { usePreviewGesture } from '@/components/AudioPreview/usePreviewGesture';

import { PlayBackBar } from './PlaybackBar';
import { PlayerControls } from './PlayerControls';

import type { Track } from '@/types/track';

const ROTATION = [
  0, 10, -10, -15, -5, 2, 14, -4, 3, 8, -12, 16, -20, -8, 4, -8
];
const Z_INDEX = [0, 2, 0, 2, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 2, 0];
const FALLBACK_COLOR = '#27272a';

interface MusicCardProps {
  track: Track;
  index: number;
  eager: boolean;
}

export const MusicCard = memo(function MusicCard({
  track,
  index,
  eager
}: MusicCardProps) {
  const gesture = usePreviewGesture(track);
  const playing = useIsPlaying(track.id);
  const hasPreview = Boolean(track.previewKey);

  return (
    <div
      {...gesture}
      tabIndex={0}
      aria-label={`${track.name}, ${track.artists.join(', ')}`}
      className="wall-card deal-in w-[21%] focus:outline-none"
      style={
        {
          '--r': `${ROTATION[index % ROTATION.length]}deg`,
          '--z': Z_INDEX[index % Z_INDEX.length],
          '--i': index
        } as React.CSSProperties
      }
    >
      <div
        style={{ backgroundColor: track.dominantColor ?? FALLBACK_COLOR }}
        className="w-28 py-2 px-3 rounded-lg bg-gradient-to-b from-transparent to-black opacity-95"
      >
        <div className="relative">
          {track.coverSmall && (
            <img
              src={track.coverSmall}
              alt=""
              width={300}
              height={300}
              loading={eager ? 'eager' : 'lazy'}
              decoding="async"
              draggable={false}
              className="w-full aspect-square object-cover"
            />
          )}
          {playing && hasPreview && (
            <div className="equalizer absolute bottom-1 right-1 flex h-3 items-end gap-[1px] rounded-sm bg-black/60 px-[2px] py-[1px]">
              <span className="block h-full w-[2px] bg-lime-300" />
              <span className="block h-full w-[2px] bg-lime-300" />
              <span className="block h-full w-[2px] bg-lime-300" />
            </div>
          )}
        </div>
        <div className="py-1 items-center inline-flex">
          <div className="flex-col inline-flex">
            <div className="text-white text-[0.45rem] font-bold tracking-tight">
              {track.name}
            </div>
            <span className="text-zinc-400 text-[0.3rem] font-medium">
              {track.artists.join(', ')}
            </span>
          </div>
        </div>
        <PlayBackBar trackId={track.id} hasPreview={hasPreview} />
        <PlayerControls playing={playing} />
      </div>
    </div>
  );
});
