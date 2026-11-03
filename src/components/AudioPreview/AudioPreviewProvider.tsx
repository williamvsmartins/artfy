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
  LEAVE_GRACE_MS,
  PREFETCH_CONCURRENCY,
  SOUND_STORAGE_KEY,
  fadeVolume,
  pendingSources,
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
  private blobs = new Map<string, string>();
  private loading = new Set<string>();
  private queue: string[] = [];
  private inFlight = 0;
  private stopTimer?: ReturnType<typeof setTimeout>;

  constructor(private store: PreviewStore) {}

  attach() {
    window.addEventListener('pointerdown', this.grantActivation);
    window.addEventListener('keydown', this.grantActivation);
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
        this.store.set({
          soundEnabled: true,
          needsActivation: navigator.userActivation?.hasBeenActive === false
        });
      }
    } catch {
      return;
    }
  }

  detach() {
    window.removeEventListener('pointerdown', this.grantActivation);
    window.removeEventListener('keydown', this.grantActivation);
    clearTimeout(this.stopTimer);
    this.queue = [];
    this.blobs.forEach((url) => URL.revokeObjectURL(url));
    this.blobs.clear();
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

  prefetch(tracks: Track[]) {
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    if (!this.store.state.soundEnabled || connection?.saveData) return;

    const known = new Set([
      ...Array.from(this.blobs.keys()),
      ...Array.from(this.loading),
      ...Array.from(this.unavailable)
    ]);
    const fresh = pendingSources(tracks.map(previewSrc), known);
    this.queue = [
      ...fresh,
      ...this.queue.filter((src) => !fresh.includes(src))
    ];
    this.pump();
  }

  private pump() {
    while (this.inFlight < PREFETCH_CONCURRENCY && this.queue.length > 0) {
      const src = this.queue.shift()!;
      this.inFlight++;
      this.loading.add(src);
      fetch(src)
        .then((response) => {
          if (response.status === 404) this.unavailable.add(src);
          if (!response.ok) return;
          return response.blob().then((blob) => {
            this.blobs.set(src, URL.createObjectURL(blob));
          });
        })
        .catch(() => undefined)
        .finally(() => {
          this.inFlight--;
          this.loading.delete(src);
          this.pump();
        });
    }
  }

  isPlaying() {
    return this.store.state.currentId !== null;
  }

  scheduleStop(trackId: string) {
    clearTimeout(this.stopTimer);
    this.stopTimer = setTimeout(() => this.stop(trackId), LEAVE_GRACE_MS);
  }

  play(track: Track) {
    clearTimeout(this.stopTimer);
    if (this.store.state.currentId === track.id) return;
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

    next.dataset.src = src;
    next.src = this.blobs.get(src) ?? src;
    next.volume = 0;
    this.store.set({
      currentId: track.id,
      color: track.dominantColor,
      progress: 0,
      duration: PREVIEW_SECONDS
    });

    const onError = () => {
      if (next.dataset.src !== src) return;
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

  private grantActivation = () => {
    if (this.store.state.needsActivation) {
      this.store.set({ needsActivation: false });
    }
  };

  toggleSound() {
    if (this.store.state.needsActivation) {
      this.grantActivation();
      return;
    }
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
      stop: (trackId: string) => player.stop(trackId),
      scheduleStop: (trackId: string) => player.scheduleStop(trackId),
      isPlaying: () => player.isPlaying()
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

export function usePrefetchPreviews(tracks: Track[], enabled = true) {
  const { player } = usePreviewContext();
  const soundEnabled = usePreviewState((state) => state.soundEnabled);

  useEffect(() => {
    if (!enabled || !soundEnabled) return;
    const timer = setTimeout(() => player.prefetch(tracks), 300);
    return () => clearTimeout(timer);
  }, [player, tracks, enabled, soundEnabled]);
}
