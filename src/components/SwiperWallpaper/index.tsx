'use client';
import React from 'react';

import 'swiper/css';
import 'swiper/css/effect-cards';

import { EffectCards } from 'swiper/modules';

import { MusicWallpaper } from '../MusicWallpaper';

import { TrackProps } from '@/services/http/topTrack/types';
import { Swiper, SwiperSlide } from 'swiper/react';

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
  return (
    <div className="flex flex-col items-center p-6">
      <Swiper
        effect={'cards'}
        loop={true}
        grabCursor={true}
        modules={[EffectCards]}
        className="mySwiper w-80 overflow-hidden"
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
