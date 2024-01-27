'use client';
import { useState } from 'react';

import 'swiper/css';

import { Swiper, SwiperSlide } from 'swiper/react';
interface SliderProps {
  words: string[];
  descriptions: string[];
}

export function Slider({ words, descriptions }: SliderProps) {
  const [activeIndex, seActiveIndex] = useState(0);

  return (
    <div className="mx-auto py-6">
      <Swiper
        slideToClickedSlide={true}
        slidesPerView={2}
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

      <div className="mt-4 justify-center text-center">
        <p className="text-white text-xl font-bold">
          {descriptions[activeIndex]}
        </p>
      </div>
    </div>
  );
}
