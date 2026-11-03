import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { SoundToggle } from '@/components/AudioPreview/SoundToggle';
import { TintedBackground } from '@/components/AudioPreview/TintedBackground';
import { Footer } from '@/components/Footer';
import { HomeHero } from '@/components/HomeHero';

import { authConfig } from '@/lib/auth';
import { getChartTracks } from '@/lib/tracks/catalog';

export default async function Page() {
  const session = await getServerSession(authConfig);
  if (session) return redirect('/wallpaper');

  const chart = await getChartTracks();

  return (
    <TintedBackground base="#171717" className="min-h-screen overflow-x-clip">
      <HomeHero chart={chart} />
      <Footer />
      <SoundToggle />
    </TintedBackground>
  );
}
