import { MusicCard } from './components/MusicCard';

import { TrackProps } from '@/services/http/topTrack/types';

interface RotationData {
  [id: number]: number;
}

interface ZIndexData {
  [id: number]: number;
}

interface MusicWallpaperProps {
  tracks: TrackProps[];
}

export async function MusicWallpaper({ tracks }: MusicWallpaperProps) {
  const rotationData: RotationData = {
    1: 0,
    2: 10,
    3: -10,
    4: -15,
    5: -5,
    6: 2,
    7: 14,
    8: -4,
    9: 3,
    10: 8,
    11: -12,
    12: 16,
    13: -20,
    14: -8,
    15: 4,
    16: -8
  };

  const zIndexData: ZIndexData = {
    1: 0,
    2: 2,
    3: 0,
    4: 2,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 2,
    10: 0,
    11: 0,
    12: 2,
    13: 0,
    14: 0,
    15: 2,
    16: 0
  };
  return (
    <div className="w-80 mx-auto flex flex-wrap overflow-hidden bg-black">
      {tracks.map((track, index) => (
        <div
          key={index}
          className="transform"
          style={{
            transform: `rotate(${rotationData[index]}deg)`,
            zIndex: zIndexData[index],
            width: '21%'
          }}
        >
          <MusicCard
            musicName={track.name}
            artistsName={track.artists}
            trackImage={track.album.images?.[0].url}
            dominantColor={track.dominantColor}
          />
        </div>
      ))}
    </div>
  );
}
