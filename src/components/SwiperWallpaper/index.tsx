'use client';
import { useEffect, useRef, useState } from 'react';

import 'swiper/css';
import 'swiper/css/effect-cards';

import { EffectCards, Keyboard } from 'swiper/modules';

import { CardBack } from '../CardBack';
import { FitToViewport } from '../FitToViewport';
import { FlipCard } from '../FlipCard';
import { MusicWallpaper } from '../MusicWallpaper';
import { PeriodTabs } from '../PeriodTabs';
import { ShareButton } from '../ShareButton';

import {
  PERIOD_LABEL,
  PERIOD_SLUG,
  PERIOD_TITLE,
  type Period
} from '@/lib/params';
import type { Track } from '@/types/track';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';

const REVEAL_DELAY_MS = 300;
const REVEAL_STAGGER_MS = 120;
const WIDE_RESERVE_PX = 150;

interface SwiperWallpaperProps {
  periods: { period: Period; tracks: Track[] }[];
}

export function SwiperWallpaper({ periods }: SwiperWallpaperProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [revealed, setRevealed] = useState(0);
  const swiperRef = useRef<SwiperClass>();

  useEffect(() => {
    const timers = periods.map((_, index) =>
      setTimeout(
        () => setRevealed(index + 1),
        REVEAL_DELAY_MS + index * REVEAL_STAGGER_MS
      )
    );
    return () => timers.forEach(clearTimeout);
  }, [periods]);

  const activePeriod = periods[activeIndex]?.period ?? 'short_term';

  const share = (
    <ShareButton
      href={`/api/share?period=${activePeriod}`}
      fileName={`artfy-${PERIOD_SLUG[activePeriod]}.png`}
      disabled={(periods[activeIndex]?.tracks.length ?? 0) === 0}
    />
  );

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center gap-6 px-2 lg:flex-row lg:justify-center lg:gap-20">
      <div className="flex flex-col items-center gap-4 text-center lg:max-w-sm lg:items-start lg:text-left">
        <p className="font-bold">
          Esse wallpaper reflete seu gosto e seu humor do último
        </p>
        <h1 className="text-outline text-6xl font-bold lg:text-8xl">
          {PERIOD_LABEL[activePeriod]}
        </h1>
        <PeriodTabs
          value={activeIndex}
          onChange={(index) => swiperRef.current?.slideToLoop(index)}
        />
        <div className="mt-4 hidden lg:block">{share}</div>
      </div>
      <FitToViewport reserve={WIDE_RESERVE_PX}>
        <Swiper
          effect={'cards'}
          loop={true}
          grabCursor={true}
          touchMoveStopPropagation={true}
          keyboard={{ enabled: true, onlyInViewport: false }}
          modules={[EffectCards, Keyboard]}
          resistance={false}
          slideToClickedSlide={true}
          className="w-80"
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        >
          {periods.map(({ period, tracks }, index) => (
            <SwiperSlide
              key={period}
              className="[&:not(.swiper-slide-active)]:pointer-events-none"
            >
              <FlipCard
                flipped={revealed > index}
                back={<CardBack title={PERIOD_TITLE[period]} />}
                front={
                  tracks.length > 0 ? (
                    <MusicWallpaper
                      tracks={tracks}
                      eager={index === 0}
                      prefetch={index === activeIndex}
                    />
                  ) : (
                    <div className="flex min-h-[26rem] w-80 items-center justify-center rounded-xl bg-black p-8 text-center text-lg font-bold text-white">
                      Ouça mais um pouco e volte aqui
                    </div>
                  )
                }
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </FitToViewport>
      <div className="lg:hidden">{share}</div>
    </div>
  );
}
