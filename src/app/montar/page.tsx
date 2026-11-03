import Link from 'next/link';

import { SoundToggle } from '@/components/AudioPreview/SoundToggle';
import { TintedBackground } from '@/components/AudioPreview/TintedBackground';
import { BuildWallpaper } from '@/components/BuildWallpaper';
import { Footer } from '@/components/Footer';

import { parseTitle, parseTrackIds } from '@/lib/params';
import { getTracksByIds } from '@/lib/tracks/catalog';

interface MontarPageProps {
  searchParams: { t?: string; title?: string; motivo?: string };
}

export default async function MontarPage({ searchParams }: MontarPageProps) {
  const ids = parseTrackIds(searchParams.t ?? null) ?? [];
  const initialTracks = ids.length > 0 ? await getTracksByIds(ids) : [];

  return (
    <TintedBackground
      base="#FFE818"
      className="min-h-screen overflow-x-clip px-4 py-6"
    >
      <header className="mx-auto mb-8 flex max-w-5xl items-center justify-between">
        <Link href="/" className="text-3xl font-extrabold">
          Artfy
        </Link>
        <span className="text-sm font-bold uppercase tracking-widest">
          Montar o meu
        </span>
      </header>
      <BuildWallpaper
        initialTracks={initialTracks}
        initialTitle={parseTitle(searchParams.title ?? null)}
        showSpotifyNotice={searchParams.motivo === 'spotify'}
      />
      <Footer black={true} />
      <SoundToggle />
    </TintedBackground>
  );
}
