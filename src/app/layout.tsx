import { Inter } from 'next/font/google';

import { NextAuthProvider } from './providers';

import TanstackProvider from '@/providers/TanstackProvider';

import './globals.css';

const font = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br" className={`${font.className} bg-neutral-900`}>
      <body>
        <TanstackProvider>
          <NextAuthProvider>{children}</NextAuthProvider>
        </TanstackProvider>
      </body>
    </html>
  );
}
