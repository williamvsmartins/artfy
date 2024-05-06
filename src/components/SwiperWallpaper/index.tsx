'use client';
import React, { useState } from 'react';

import 'swiper/css';
import 'swiper/css/effect-cards';

import { EffectCards } from 'swiper/modules';

import { MusicWallpaper } from '../MusicWallpaper';

import { TrackProps } from '@/services/http/topTrack/types';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';

interface SwiperWallpaperProps {
  shortTermTracks: TrackProps[];
  mediumTermTracks: TrackProps[];
  longTermTracks: TrackProps[];
}

export function SwiperWallpaper({
  shortTermTracks,
  mediumTermTracks,
  longTermTracks
}: SwiperWallpaperProps) {
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
          <MusicWallpaper tracks={shortTermTracks} />
        </SwiperSlide>
        <SwiperSlide>
          <MusicWallpaper tracks={mediumTermTracks} />
        </SwiperSlide>
        <SwiperSlide>
          <MusicWallpaper tracks={longTermTracks} />
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
