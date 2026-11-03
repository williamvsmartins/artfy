'use client';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore
} from 'react';

import {
  CROSSFADE_MS,
  SOUND_STORAGE_KEY,
  fadeVolume,
  previewSrc
} from '@/lib/audio/gesture';
import type { Track } from '@/types/track';

type PreviewState = {
  currentId: string | null;
  color: string | null;
  soundEnabled: boolean;
  needsActivation: boolean;
  progress: number;
  duration: number;
};

const PREVIEW_SECONDS = 30;

const INITIAL_STATE: PreviewState = {
  currentId: null,
  color: null,
  soundEnabled: false,
  needsActivation: false,
  progress: 0,
  duration: PREVIEW_SECONDS
};

class PreviewStore {
  state: PreviewState = INITIAL_STATE;
  private listeners = new Set<() => void>();

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  set(partial: Partial<PreviewState>) {
    this.state = { ...this.state, ...partial };
    this.listeners.forEach((listener) => listener());
  }
}

class PreviewPlayer {
  private players: HTMLAudioElement[] = [];
  private active = 0;
  private fades = new Map<HTMLAudioElement, number>();
  private requestId = 0;
  private unavailable = new Set<string>();

  constructor(private store: PreviewStore) {}

  attach() {
    this.players = [new Audio(), new Audio()];
    this.players.forEach((audio) => {
      audio.preload = 'none';
      audio.addEventListener('timeupdate', () => {
        if (audio !== this.players[this.active]) return;
        this.store.set({
          progress: audio.currentTime,
          duration: Number.isFinite(audio.duration)
            ? audio.duration
            : PREVIEW_SECONDS
        });
      });
      audio.addEventListener('ended', () => {
        const { currentId } = this.store.state;
        if (audio === this.players[this.active] && currentId) {
          this.stop(currentId);
        }
      });
    });
    try {
      if (window.localStorage.getItem(SOUND_STORAGE_KEY) === '1') {
        this.store.set({ soundEnabled: true });
      }
    } catch {
      return;
    }
  }

  detach() {
    this.fades.forEach((frame) => cancelAnimationFrame(frame));
    this.players.forEach((audio) => {
      audio.pause();
      audio.removeAttribute('src');
    });
  }

  private fade(audio: HTMLAudioElement, to: number, onDone?: () => void) {
    const running = this.fades.get(audio);
    if (running) cancelAnimationFrame(running);
    const from = audio.volume;
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      audio.volume = fadeVolume(elapsed, CROSSFADE_MS, from, to);
      if (elapsed < CROSSFADE_MS) {
        this.fades.set(audio, requestAnimationFrame(step));
      } else {
        this.fades.delete(audio);
        onDone?.();
      }
    };
    this.fades.set(audio, requestAnimationFrame(step));
  }

  play(track: Track) {
    const src = previewSrc(track);
    if (
      !src ||
      this.unavailable.has(src) ||
      !this.store.state.soundEnabled ||
      this.players.length === 0
    ) {
      return;
    }

    const requestId = ++this.requestId;
    const previous = this.players[this.active];
    this.active = 1 - this.active;
    const next = this.players[this.active];

    next.src = src;
    next.volume = 0;
    this.store.set({
      currentId: track.id,
      color: track.dominantColor,
      progress: 0,
      duration: PREVIEW_SECONDS
    });

    const onError = () => {
      if (next.src !== new URL(src, window.location.href).href) return;
      this.unavailable.add(src);
      if (this.store.state.currentId === track.id) {
        this.store.set({ currentId: null, color: null });
      }
    };
    next.addEventListener('error', onError, { once: true });

    next
      .play()
      .then(() => {
        if (requestId !== this.requestId) return;
        this.fade(next, 1);
        this.fade(previous, 0, () => previous.pause());
      })
      .catch((error: unknown) => {
        if (requestId !== this.requestId) return;
        const blocked =
          error instanceof DOMException && error.name === 'NotAllowedError';
        this.store.set({
          currentId: null,
          color: null,
          needsActivation: blocked
        });
      });
  }

  stop(trackId: string) {
    if (this.store.state.currentId !== trackId) return;
    this.requestId++;
    const audio = this.players[this.active];
    this.store.set({ currentId: null, color: null, progress: 0 });
    if (audio) this.fade(audio, 0, () => audio.pause());
  }

  toggleSound() {
    const enabled = !this.store.state.soundEnabled;
    const { currentId } = this.store.state;
    if (!enabled && currentId) this.stop(currentId);
    this.store.set({ soundEnabled: enabled, needsActivation: false });
    try {
      window.localStorage.setItem(SOUND_STORAGE_KEY, enabled ? '1' : '0');
    } catch {
      return;
    }
  }
}

type PreviewContext = { store: PreviewStore; player: PreviewPlayer };

const AudioPreviewContext = createContext<PreviewContext | null>(null);

export function AudioPreviewProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<PreviewContext>();
  if (!ref.current) {
    const store = new PreviewStore();
    ref.current = { store, player: new PreviewPlayer(store) };
  }

  useEffect(() => {
    const { player } = ref.current!;
    player.attach();
    return () => player.detach();
  }, []);

  return (
    <AudioPreviewContext.Provider value={ref.current}>
      {children}
    </AudioPreviewContext.Provider>
  );
}

function usePreviewContext() {
  const context = useContext(AudioPreviewContext);
  if (!context) throw new Error('AudioPreviewProvider ausente');
  return context;
}

function usePreviewState<T>(select: (state: PreviewState) => T): T {
  const { store } = usePreviewContext();
  return useSyncExternalStore(
    store.subscribe,
    () => select(store.state),
    () => select(INITIAL_STATE)
  );
}

export function useAudioPreview() {
  const { player } = usePreviewContext();
  const soundEnabled = usePreviewState((state) => state.soundEnabled);
  const needsActivation = usePreviewState((state) => state.needsActivation);

  return useMemo(
    () => ({
      soundEnabled,
      needsActivation,
      toggleSound: () => player.toggleSound(),
      play: (track: Track) => player.play(track),
      stop: (trackId: string) => player.stop(trackId)
    }),
    [player, soundEnabled, needsActivation]
  );
}

export function useIsPlaying(trackId: string) {
  return usePreviewState((state) => state.currentId === trackId);
}

export function useAudioProgress(trackId: string) {
  const current = usePreviewState((state) =>
    state.currentId === trackId ? Math.floor(state.progress) : 0
  );
  const duration = usePreviewState((state) =>
    state.currentId === trackId ? Math.round(state.duration) : PREVIEW_SECONDS
  );
  return { current, duration };
}

export function useCurrentTrackColor() {
  return usePreviewState((state) => state.color);
}

export function usePreviewStore() {
  return usePreviewContext().store;
}
