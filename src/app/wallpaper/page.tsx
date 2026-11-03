import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { SoundToggle } from '@/components/AudioPreview/SoundToggle';
import { TintedBackground } from '@/components/AudioPreview/TintedBackground';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { SwiperWallpaper } from '@/components/SwiperWallpaper';

import { authConfig, loginIsRequiredServer } from '@/lib/auth';
import { PERIODS } from '@/lib/params';
import { SpotifyApiError, getTopTracks } from '@/lib/spotify';

export default async function Wallpaper() {
  await loginIsRequiredServer();
  const session = await getServerSession(authConfig);
  const accessToken = session?.user?.accessToken;

  if (!accessToken || session?.user?.error) {
    throw new Error('Sessão do Spotify expirada');
  }

  let periods;
  try {
    periods = await Promise.all(
      PERIODS.map(async (period) => ({
        period,
        tracks: await getTopTracks(period, accessToken)
      }))
    );
  } catch (error) {
    if (error instanceof SpotifyApiError && error.status === 403) {
      redirect('/montar?motivo=spotify');
    }
    throw error;
  }

  return (
    <TintedBackground
      base="#FFE818"
      className="min-h-screen flex flex-col items-center p-6"
    >
      <Header />
      <SwiperWallpaper periods={periods} />
      <Footer black={true} />
      <SoundToggle />
    </TintedBackground>
  );
}
