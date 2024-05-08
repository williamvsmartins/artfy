'use client';
import { signOut } from 'next-auth/react';
import { MdLogout } from 'react-icons/md';

export function Header() {
  const logout = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <header className="top-0 flex items-center justify-center w-full p-4">
      <div className="flex items-center justify-center">
        <h1 className="text-center text-6xl font-bold">Artfy</h1>
      </div>
      <div className="absolute right-10">
        <button
          className="flex items-center justify-center bg-black bg-opacity-80 rounded-full h-10 w-10 hover:bg-[#181818] focus:outline-none cursor-pointer"
          onClick={logout}
        >
          <MdLogout color="#fff" fontSize={24} />
        </button>
      </div>
    </header>
  );
}
