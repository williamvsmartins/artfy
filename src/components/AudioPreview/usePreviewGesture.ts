'use client';
import { useEffect, useRef, useState } from 'react';

import { useAudioPreview } from './AudioPreviewProvider';

import { HOLD_MS, HOVER_INTENT_MS, isHoldCancelled } from '@/lib/audio/gesture';
import type { Track } from '@/types/track';

export function usePreviewGesture(track: Track) {
  const { play, stop } = useAudioPreview();
  const [active, setActive] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const origin = useRef<{ x: number; y: number } | null>(null);

  const clearTimer = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = undefined;
  };

  useEffect(() => clearTimer, []);

  const release = () => {
    clearTimer();
    origin.current = null;
    setActive(false);
    stop(track.id);
  };

  return {
    'data-active': active,
    onPointerEnter: (event: React.PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      clearTimer();
      timer.current = setTimeout(() => play(track), HOVER_INTENT_MS);
    },
    onPointerLeave: (event: React.PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      release();
    },
    onPointerDown: (event: React.PointerEvent) => {
      if (event.pointerType === 'mouse') return;
      origin.current = { x: event.clientX, y: event.clientY };
      clearTimer();
      timer.current = setTimeout(() => {
        setActive(true);
        play(track);
      }, HOLD_MS);
    },
    onPointerMove: (event: React.PointerEvent) => {
      if (!origin.current || active) return;
      const dx = event.clientX - origin.current.x;
      const dy = event.clientY - origin.current.y;
      if (isHoldCancelled(dx, dy)) {
        clearTimer();
        origin.current = null;
      }
    },
    onPointerUp: (event: React.PointerEvent) => {
      if (event.pointerType !== 'mouse') release();
    },
    onPointerCancel: release,
    onContextMenu: (event: React.MouseEvent) => event.preventDefault()
  };
}
