'use client';
import { useAudioProgress } from '@/components/AudioPreview/AudioPreviewProvider';

const formatTime = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

interface PlayBackBarProps {
  trackId: string;
  hasPreview: boolean;
}

export function PlayBackBar({ trackId, hasPreview }: PlayBackBarProps) {
  const { current, duration } = useAudioProgress(trackId);
  const progress = duration > 0 ? Math.min(current / duration, 1) : 0;

  return (
    <div className="w-full flex-col items-start flex">
      <div className="h-[0.1rem] rounded-full w-full bg-zinc-600">
        <div
          className="bg-zinc-200 h-[0.1rem] rounded-full transition-[width] duration-300 ease-linear"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <div className="self-stretch items-center gap-4 inline-flex">
        <span className="flex-grow flex-shrink text-[0.4rem] text-zinc-400">
          {hasPreview ? formatTime(current) : '--:--'}
        </span>
        <span className="text-[0.4rem] text-zinc-400">
          {hasPreview ? formatTime(duration) : '--:--'}
        </span>
      </div>
    </div>
  );
}
