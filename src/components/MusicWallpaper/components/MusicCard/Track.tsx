import { ImagemTrack } from './ImageTrack';
import { PlayBackBar } from './PlaybackBar';
import { PlayerControls } from './PlayerControls';

export function Track() {
  return (
    <div className="w-28 py-2 px-3 rounded-lg bg-[#d9495d] filter backdrop-blur-sm bg-gradient-to-b from-transparent to-black opacity-95">
      <ImagemTrack />
      <div className="py-1 items-center inline-flex">
        <div className="self-stretch flex-col inline-flex">
          <div className="text-white text-[0.45rem] font-bold font-['Roboto'] tracking-tight">
            You Rock My World
          </div>
          <div className="self-stretch text-zinc-400 text-[0.39rem] font-medium font-['Roboto'] tracking-tight">
            Michael Jackson
          </div>
        </div>
      </div>
      <PlayBackBar />
      <PlayerControls />
    </div>
  );
}
