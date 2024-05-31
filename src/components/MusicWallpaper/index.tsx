import { useState } from 'react';

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

export function MusicWallpaper({ tracks }: MusicWallpaperProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const rotationData: RotationData = {
    0: 0,
    1: 10,
    2: -10,
    3: -15,
    4: -5,
    5: 2,
    6: 14,
    7: -4,
    8: 3,
    9: 8,
    10: -12,
    11: 16,
    12: -20,
    13: -8,
    14: 4,
    15: -8
  };

  const zIndexData: ZIndexData = {
    0: 0,
    1: 2,
    2: 0,
    3: 2,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 2,
    9: 0,
    10: 0,
    11: 2,
    12: 0,
    13: 0,
    14: 2,
    15: 0
  };

  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };
  return (
    <div className="w-80 flex flex-wrap rounded-xl bg-black">
      {tracks.map((track, index) => (
        <div
          key={index}
          style={{
            transform: `rotate(${
              hoveredIndex === index ? 0 : rotationData[index]
            }deg) scale(${hoveredIndex === index ? 1.9 : 1})`,
            zIndex: hoveredIndex === index ? 3 : zIndexData[index],
            width: '21%',
            transition: 'transform 0.4s ease'
          }}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
        >
          <MusicCard
            musicName={track.name}
            artistsName={track.artists}
            trackImage={track.album.images?.[1].url}
            dominantColor={track.dominantColor}
            audioUrl={track.preview_url}
          />
        </div>
      ))}
    </div>
  );
}
