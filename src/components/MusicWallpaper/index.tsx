import { MusicCard } from './components/MusicCard';

import type { Track } from '@/types/track';

interface MusicWallpaperProps {
  tracks: Track[];
  eager?: boolean;
}

export function MusicWallpaper({ tracks, eager = false }: MusicWallpaperProps) {
  return (
    <div className="w-80 flex flex-wrap rounded-xl bg-black">
      {tracks.map((track, index) => (
        <MusicCard
          key={`${track.id}:${index}`}
          track={track}
          index={index}
          eager={eager}
        />
      ))}
    </div>
  );
}
