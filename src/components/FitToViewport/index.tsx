'use client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;

const WIDE_QUERY = '(min-width: 1024px)';
const SIDE_GUTTER = 32;
const MIN_SCALE = 0.5;

interface FitToViewportProps {
  reserve: number;
  children: React.ReactNode;
}

export function FitToViewport({ reserve, children }: FitToViewportProps) {
  const inner = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState<{ scale: number; height: number } | null>(
    null
  );

  useIsomorphicLayoutEffect(() => {
    const element = inner.current;
    if (!element) return;

    const update = () => {
      const height = element.offsetHeight;
      const width = element.offsetWidth;
      if (!height || !width) return;
      const available = window.matchMedia(WIDE_QUERY).matches
        ? (window.innerHeight - reserve) / height
        : (window.innerWidth - SIDE_GUTTER) / width;
      const scale = Math.max(MIN_SCALE, Math.min(1, available));
      setFit({ scale, height: height * scale });
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    window.addEventListener('resize', update);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [reserve]);

  return (
    <div
      className="flex justify-center"
      style={{ height: fit ? fit.height : undefined }}
    >
      <div
        ref={inner}
        className="origin-top self-start"
        style={{ transform: fit ? `scale(${fit.scale})` : undefined }}
      >
        {children}
      </div>
    </div>
  );
}
