'use client';
import Link from 'next/link';

import 'swiper/css';
import 'swiper/css/effect-cards';

import { EffectCards, Keyboard } from 'swiper/modules';

import { CardBack } from '../CardBack';
import { FitToViewport } from '../FitToViewport';
import { MusicWallpaper } from '../MusicWallpaper';
import { SpotifySignInButton } from '../SpotifySignInButton';
import { StoryPreview } from '../StoryPreview';

import type { Track } from '@/types/track';
import { Swiper, SwiperSlide } from 'swiper/react';

const HIDDEN_CARDS = ['SEU MÊS', 'SEU SEMESTRE', 'SEU ANO'];
const HOME_RESERVE_PX = 150;

interface HomeHeroProps {
  chart: Track[] | null;
}

export function HomeHero({ chart }: HomeHeroProps) {
  return (
    <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center gap-10 px-4 py-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
      <div className="flex max-w-sm flex-col items-center gap-5 text-center lg:items-start lg:text-left">
        <span className="text-sm font-bold uppercase tracking-[0.3em] text-lime-300">
          Artfy
        </span>
        <h1 className="text-5xl font-extrabold leading-tight text-white">
          Suas músicas viram arte.
        </h1>
        <p className="text-lg text-neutral-300">
          O Artfy pega o que você mais ouviu e monta um wallpaper só seu, pronto
          pro story.
        </p>
        <SpotifySignInButton />
        <Link
          href="/montar"
          className="flex w-full max-w-xs items-center justify-center rounded-full border-2 border-lime-300 px-6 py-3 font-bold text-lime-300 transition hover:bg-lime-300 hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-300"
        >
          Montar o meu
        </Link>
        <p className="text-sm text-neutral-400">
          Funciona sem Spotify: você escolhe as músicas.
        </p>
      </div>

      <div className="flex flex-col items-center gap-4">
        <FitToViewport reserve={HOME_RESERVE_PX}>
          <Swiper
            effect={'cards'}
            grabCursor={true}
            keyboard={{ enabled: true }}
            modules={[EffectCards, Keyboard]}
            className="w-80"
          >
            <SwiperSlide>
              {chart ? (
                <div className="flex flex-col items-center gap-2">
                  <MusicWallpaper tracks={chart} eager prefetch />
                </div>
              ) : (
                <CardBack title="O BRASIL AGORA" />
              )}
            </SwiperSlide>
            {HIDDEN_CARDS.map((title) => (
              <SwiperSlide key={title}>
                <CardBack title={title} />
              </SwiperSlide>
            ))}
          </Swiper>
        </FitToViewport>
        <p className="mt-4 text-center text-sm font-semibold text-neutral-300">
          <span className="text-lime-300">O BRASIL AGORA</span> ·{' '}
          <span className="hidden [@media(hover:hover)]:inline">
            passe o mouse numa capa para ouvir
          </span>
          <span className="[@media(hover:hover)]:hidden">
            segure uma capa para ouvir
          </span>
        </p>
      </div>

      {chart && <StoryPreview src="/api/share?chart=brasil" />}
    </section>
  );
}
