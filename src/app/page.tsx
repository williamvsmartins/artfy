import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { MusicWallpaper } from '@/components/MusicWallpaper';
import { Slider } from '@/components/Slider';
import { SpotifySignInButton } from '@/components/SpotifySignInButton';

import { authConfig } from '@/lib/auth';

const words = ['Artfy'];
const descriptions = [
  'Artfy transforma suas músicas mais ouvidas em Wallpapers aesthetics'
];

export default async function Page() {
  const session = await getServerSession(authConfig);

  if (session) return redirect('/wallpaper');

  return (
    <div className="flex flex-col items-center p-6">
      <Slider words={words} descriptions={descriptions} />
      <SpotifySignInButton />
      <MusicWallpaper />
    </div>
  );
}
