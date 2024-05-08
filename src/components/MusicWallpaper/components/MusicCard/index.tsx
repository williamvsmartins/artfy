'use client';
import { useRef } from 'react';

import { PlayBackBar } from './PlaybackBar';
import { PlayerControls } from './PlayerControls';

import { AlbumProps, ImageProps } from '@/services/http/topTrack/types';
interface MusicCardProps {
  musicName: string;
  artistsName: [AlbumProps];
  trackImage: ImageProps['url'] | undefined;
  dominantColor: string;
  audioUrl: string;
}

const fadeInInterval = 100;
const fadeOutInterval = 100;
const maxVolume = 1;
const minVolume = 0.001;

export function MusicCard({
  musicName,
  artistsName,
  trackImage,
  dominantColor,
  audioUrl
}: MusicCardProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  const fadeInIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const fadeIn = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = minVolume;
    audio.play();
    fadeInIntervalRef.current = setInterval(() => {
      if (audio.volume < maxVolume) {
        audio.volume = Math.min(audio.volume + 0.005, maxVolume);
      } else {
        clearInterval(fadeInIntervalRef.current!);
      }
    }, fadeInInterval);
  };

  const fadeOut = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (fadeInIntervalRef.current) {
      clearInterval(fadeInIntervalRef.current);
    }
    const interval = setInterval(() => {
      if (audio.volume > minVolume) {
        audio.volume = Math.max(audio.volume - 0.007, minVolume);
      } else {
        audio.pause();
        clearInterval(interval);
      }
    }, fadeOutInterval);
  };

  return (
    <div
      style={{ backgroundColor: dominantColor }}
      className={`w-28 py-2 px-3 rounded-lg filter backdrop-blur-sm bg-gradient-to-b from-transparent to-black opacity-95 select-none`}
      onMouseEnter={() => {
        fadeIn();
      }}
      onMouseLeave={() => {
        fadeOut();
      }}
    >
      {trackImage && <img src={trackImage} width={300} height={300} />}
      <div className="py-1 items-center inline-flex">
        <div className="flex-col inline-flex">
          <div className="text-white text-[0.45rem] font-bold font-['Roboto'] tracking-tight">
            {musicName}
          </div>
          <span className="text-zinc-400 text-[0.3rem] font-medium font-['Roboto']">
            {artistsName.map((artist) => artist.name).join(', ')}
          </span>
        </div>
      </div>
      <PlayBackBar />
      <PlayerControls />
      <audio ref={audioRef} src={audioUrl} />
    </div>
  );
}
