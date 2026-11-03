import { Inter } from 'next/font/google';
import localFont from 'next/font/local';

import { AudioPreviewProvider } from '@/components/AudioPreview/AudioPreviewProvider';

import { NextAuthProvider } from './providers';

import TanstackProvider from '@/providers/TanstackProvider';

import './globals.css';

const font = Inter({ subsets: ['latin'] });
const outlineFont = localFont({
  src: [
    { path: '../fonts/inter-700.ttf', weight: '700' },
    { path: '../fonts/inter-800.ttf', weight: '800' }
  ],
  variable: '--font-outline',
  display: 'swap'
});

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-br"
      className={`${font.className} ${outlineFont.variable} bg-neutral-900`}
    >
      <body>
        <TanstackProvider>
          <NextAuthProvider>
            <AudioPreviewProvider>{children}</AudioPreviewProvider>
          </NextAuthProvider>
        </TanstackProvider>
      </body>
    </html>
  );
}
