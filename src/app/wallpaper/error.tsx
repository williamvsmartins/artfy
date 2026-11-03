'use client';
import { signIn } from 'next-auth/react';

export default function WallpaperError({ reset }: { reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[#FFE818] p-6 text-center">
      <h1 className="text-outline text-5xl font-extrabold">Ops</h1>
      <p className="max-w-xs font-bold">
        Não deu pra carregar suas músicas agora. Tente de novo ou entre outra
        vez com o Spotify.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-black px-6 py-3 font-bold text-[#FFE818]"
        >
          Tentar de novo
        </button>
        <button
          type="button"
          onClick={() => signIn('spotify', { callbackUrl: '/wallpaper' })}
          className="rounded-full border-2 border-black px-6 py-3 font-bold"
        >
          Entrar de novo
        </button>
      </div>
    </div>
  );
}
