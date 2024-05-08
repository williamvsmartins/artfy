'use client';
import { useState } from 'react';

import 'swiper/css';

import { MusicWallpaper } from '../MusicWallpaper';
import { SpotifySignInButton } from '../SpotifySignInButton';

import { TrackProps } from '@/services/http/topTrack/types';
import { Swiper, SwiperSlide } from 'swiper/react';
interface SliderProps {
  words: string[];
  descriptions: string[];
  tracks: TrackProps[];
}

export function Slider({ words, descriptions, tracks }: SliderProps) {
  const [activeIndex, seActiveIndex] = useState(0);
  const breakpoints = {
    768: {
      slidesPerView: 3
    },
    1024: {
      slidesPerView: 4
    }
  };

  return (
    <div className="mx-auto py-6">
      <Swiper
        slideToClickedSlide={true}
        slidesPerView={2}
        breakpoints={breakpoints}
        centeredSlides={true}
        grabCursor={true}
        onSlideChange={(swiper) => {
          seActiveIndex(swiper.activeIndex);
        }}
      >
        {words.map((word, index) => (
          <SwiperSlide key={index} className={'pb-12 text-center'}>
            <span
              key={index}
              className={`text-6xl text-lime-300 font-bold text-center ${
                index === activeIndex ? 'text-lime-300' : 'text-white'
              }`}
            >
              {word}
            </span>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="flex flex-col items-center justify-center p-6 mx-auto md:items-start md:flex-row md:gap-16">
        <div className="flex flex-col items-center text-center justify-center md:justify-start md:text-start md:mt-32">
          <p className="max-w-xs text-white text-xl font-bold">
            {descriptions[activeIndex]}
          </p>
          <SpotifySignInButton />
        </div>
        {tracks && <MusicWallpaper tracks={tracks} />}
      </div>
    </div>
  );
}
