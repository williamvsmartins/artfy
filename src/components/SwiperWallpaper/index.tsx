'use client';
import { Session } from 'next-auth';
import React, { useState } from 'react';

import 'swiper/css';
import 'swiper/css/effect-cards';

import { EffectCards } from 'swiper/modules';

import { MusicWallpaper } from '../MusicWallpaper';

import { useTopTracks } from '@/hooks/useTopTracks';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';

interface SwiperWallpaperProps {
  session: Session | null;
}

export function SwiperWallpaper({ session }: SwiperWallpaperProps) {
  const [selectedCard, setSelectedCard] = useState('Mês');

  const handleSlideChange = (swiper: SwiperClass) => {
    const realIndex = swiper.realIndex;
    if (realIndex === 0) {
      setSelectedCard('Mês');
    } else if (realIndex === 1) {
      setSelectedCard('Semestre');
    } else if (realIndex === 2) {
      setSelectedCard('Ano');
    }
  };
  const [shortTermTracks, mediumTermTracks, longTermTracks] =
    useTopTracks(session);

  return (
    <div className="flex flex-col items-center p-6">
      <div className="text-center mb-4">
        <p className="font-bold">
          Esse wallpaper reflete seu gosto e seu humor do último
        </p>
        <h1 className="text-6xl font-bold text-center py-8">{selectedCard}</h1>
      </div>
      <Swiper
        effect={'cards'}
        loop={true}
        grabCursor={true}
        touchMoveStopPropagation={true}
        modules={[EffectCards]}
        className="mySwiper w-80 overflow-hidden"
        onSlideChange={(swiper) => handleSlideChange(swiper)}
      >
        <SwiperSlide>
          {shortTermTracks.data && (
            <MusicWallpaper tracks={shortTermTracks.data} />
          )}
        </SwiperSlide>
        <SwiperSlide>
          {mediumTermTracks.data && (
            <MusicWallpaper tracks={mediumTermTracks.data} />
          )}
        </SwiperSlide>
        <SwiperSlide>
          {longTermTracks.data && (
            <MusicWallpaper tracks={longTermTracks.data} />
          )}
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
