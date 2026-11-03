'use client';
import { signOut } from 'next-auth/react';
import { MdLogout } from 'react-icons/md';

export function Header() {
  return (
    <header className="flex w-full items-center justify-between px-2 py-2">
      <span className="text-3xl font-extrabold">Artfy</span>
      <button
        type="button"
        aria-label="Sair"
        title="Sair"
        onClick={() => signOut({ callbackUrl: '/' })}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-black/80 hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
      >
        <MdLogout color="#fff" fontSize={22} />
      </button>
    </header>
  );
}
