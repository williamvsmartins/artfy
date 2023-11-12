import { BsShuffle, BsFillPlayCircleFill } from 'react-icons/bs';
import { CgPlayTrackPrev, CgPlayTrackNext } from 'react-icons/cg';
import { FiRepeat } from 'react-icons/fi';

export function PlayerControls() {
  return (
    <div className="flex items-center	justify-center gap-5 text-white">
      <div>
        <BsShuffle />
      </div>
      <div className="text-5xl">
        <CgPlayTrackPrev />
      </div>
      <div className="text-5xl">
        <BsFillPlayCircleFill />
      </div>
      <div className="text-5xl">
        <CgPlayTrackNext />
      </div>
      <div className="">
        <FiRepeat />
      </div>
    </div>
  );
}
