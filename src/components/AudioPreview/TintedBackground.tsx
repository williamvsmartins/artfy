'use client';
import { useEffect, useRef } from 'react';

import { usePreviewStore } from './AudioPreviewProvider';

import { mixHex } from '@/lib/color';

interface TintedBackgroundProps {
  base: string;
  className?: string;
  children: React.ReactNode;
}

export function TintedBackground({
  base,
  className = '',
  children
}: TintedBackgroundProps) {
  const store = usePreviewStore();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const paint = () => {
      const { color } = store.state;
      ref.current?.style.setProperty(
        '--artfy-bg',
        color ? mixHex(color, base, 0.5) : base
      );
    };
    paint();
    return store.subscribe(paint);
  }, [store, base]);

  return (
    <div
      ref={ref}
      style={{ backgroundColor: `var(--artfy-bg, ${base})` }}
      className={`transition-colors duration-700 motion-reduce:transition-none ${className}`}
    >
      {children}
    </div>
  );
}
