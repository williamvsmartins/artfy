import { PlayBackBar } from './PlaybackBar';
import { PlayerControls } from './PlayerControls';

import { AlbumProps, ImageProps } from '@/services/http/topTrack/types';
interface MusicCardProps {
  musicName: string;
  artistsName: [AlbumProps];
  trackImage: ImageProps['url'] | undefined;
}

export function MusicCard({
  musicName,
  artistsName,
  trackImage
}: MusicCardProps) {
  return (
    <div className="w-28 py-2 px-3 rounded-lg bg-[#d9495d] filter backdrop-blur-sm bg-gradient-to-b from-transparent to-black opacity-95">
      {trackImage && <img src={trackImage} width={300} height={300} />}
      <div className="py-1 items-center inline-flex">
        <div className="flex-col inline-flex">
          <div className="text-white text-[0.45rem] font-bold font-['Roboto'] tracking-tight">
            {musicName}
          </div>
          <span className="text-zinc-400 text-[0.3rem] font-medium font-['Roboto']">
            {artistsName.map((artist) => artist.name).join(', ')}
          </span>
        </div>
      </div>
      <PlayBackBar />
      <PlayerControls />
    </div>
  );
}
