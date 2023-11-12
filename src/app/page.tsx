import { MusicWallpaper } from '@/components/MusicWallpaper';
import { Slider } from '@/components/Slider';

const words = ['Artfy'];
const descriptions = [
  'Artfy transforma suas músicas mais ouvidas em Wallpapers aesthetics'
];

export default function Page() {
  return (
    <>
      <Slider words={words} descriptions={descriptions} />;
      <MusicWallpaper />
    </>
  );
}
