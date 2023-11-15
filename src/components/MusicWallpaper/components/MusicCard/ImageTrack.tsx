'use client';

import Image from 'next/image';

const imageLoader = () => {
  return 'https://i.scdn.co/image/ab67706c0000da84b5cad30584f92f8f2bd3a7b8';
};

export function ImagemTrack() {
  return (
    <Image
      loader={imageLoader}
      src="me.png"
      width={300}
      height={300}
      alt="Picture of the author"
    />
  );
}
