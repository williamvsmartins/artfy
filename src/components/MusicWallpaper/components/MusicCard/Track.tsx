import { ImagemTrack } from './ImageTrack';
import { PlayBackBar } from './PlaybackBar';
import { PlayerControls } from './PlayerControls';

export function Track() {
  return (
    <div className="flex-col justify-start gap-2 inline-flex">
      <ImagemTrack />
      <div className="py-3 items-center inline-flex">
        <div className="self-stretch flex-col gap-1 inline-flex">
          <div className="self-stretch text-white text-xl font-bold font-['Roboto'] tracking-tight">
            You Rock My World
          </div>
          <div className="self-stretch text-zinc-400 text-sm font-medium font-['Roboto'] tracking-tight">
            Michael Jackson
          </div>
        </div>
        <div className="w-12 h-12 p-3 justify-center items-center flex">
          <div className="w-6 h-6 relative flex-col justify-start items-start flex" />
        </div>
      </div>
      <PlayBackBar />
      <PlayerControls />
    </div>
  );
}
