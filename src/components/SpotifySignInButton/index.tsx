'use client';
import { signIn } from 'next-auth/react';
import Image from 'next/image';

import spotifyLogo from '../../../public/spotify.svg';

export function SpotifySignInButton() {
  const handleClick = () => {
    signIn('spotify');
  };
  return (
    <button
      onClick={handleClick}
      className="w-96 h-9 flex justify-center items-center my-10 p-4 bg-green-500 rounded-md"
    >
      <Image src={spotifyLogo} alt="Spotify Logo" width={20} height={20} />
      <span className="text-white font-semibold ml-2">Criar com Spotify</span>
    </button>
  );
}
