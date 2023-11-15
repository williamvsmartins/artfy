import { BsShuffle, BsFillPlayCircleFill } from 'react-icons/bs';
import { CgPlayTrackPrev, CgPlayTrackNext } from 'react-icons/cg';
import { FiRepeat } from 'react-icons/fi';

export function PlayerControls() {
  return (
    <div className="flex items-center justify-center gap-1 text-white">
      <div className="text-[0.4rem]">
        <BsShuffle />
      </div>
      <div className="text-[0.9rem]">
        <CgPlayTrackPrev />
      </div>
      <div className="text-[1rem]">
        <BsFillPlayCircleFill />
      </div>
      <div className="text-[0.9rem]">
        <CgPlayTrackNext />
      </div>
      <div className="text-[0.4rem]">
        <FiRepeat />
      </div>
    </div>
  );
}
