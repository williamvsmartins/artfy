import { Inter } from 'next/font/google';

const font = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br" className={font.className}>
      <body>{children}</body>
    </html>
  );
}
