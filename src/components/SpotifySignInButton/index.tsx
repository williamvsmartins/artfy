'use client';
import { signIn } from 'next-auth/react';
import Image from 'next/image';

import spotifyLogo from '../../../public/spotify.svg';

export function SpotifySignInButton() {
  return (
    <button
      type="button"
      onClick={() => signIn('spotify', { callbackUrl: '/wallpaper' })}
      className="flex w-full max-w-xs items-center justify-center gap-2 rounded-full bg-green-500 px-6 py-3 font-bold text-white transition hover:bg-green-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-300"
    >
      <Image src={spotifyLogo} alt="" width={20} height={20} />
      Desvirar as minhas
    </button>
  );
}
