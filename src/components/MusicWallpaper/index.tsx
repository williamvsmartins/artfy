import { MusicCard } from './components/MusicCard';

interface RotationData {
  [id: number]: number;
}

interface ZIndexData {
  [id: number]: number;
}

export function MusicWallpaper() {
  const tracks = [
    { id: 1, title: 'You Rock My World', artist: 'Michael Jackson' },
    { id: 2, title: 'Thriller', artist: 'Michael Jackson' },
    { id: 3, title: 'Billie Jean', artist: 'Michael Jackson' },
    { id: 4, title: 'Beat It', artist: 'Michael Jackson' },
    { id: 5, title: 'Smooth Criminal', artist: 'Michael Jackson' },
    { id: 6, title: 'Man in the Mirror', artist: 'Michael Jackson' },
    { id: 7, title: 'Black Or White', artist: 'Michael Jackson' },
    { id: 8, title: 'Remember the Time', artist: 'Michael Jackson' },
    { id: 9, title: 'Heal the World', artist: 'Michael Jackson' },
    { id: 10, title: 'They Dont Care About Us', artist: 'Michael Jackson' },
    { id: 11, title: 'Invincible', artist: 'Michael Jackson' },
    { id: 12, title: 'Can You Feel It', artist: 'Michael Jackson' },
    { id: 13, title: 'Rock With You', artist: 'Michael Jackson' },
    { id: 14, title: 'Off the Wall', artist: 'Michael Jackson' },
    {
      id: 15,
      title: 'Dont Stop Til You Get Enough',
      artist: 'Michael Jackson',
      shouldRotate: true
    },
    { id: 16, title: 'ABC', artist: 'Michael Jackson', shouldRotate: true }
  ];

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
    <div className="w-80 mx-auto flex flex-wrap overflow-hidden">
      {tracks.map((track) => (
        <div
          key={track.id}
          className="transform"
          style={{
            transform: `rotate(${rotationData[track.id]}deg)`,
            zIndex: zIndexData[track.id],
            width: '21%'
          }}
        >
          <MusicCard />
        </div>
      ))}
    </div>
  );
}
