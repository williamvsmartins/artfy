'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { usePrefetchPreviews } from '@/components/AudioPreview/AudioPreviewProvider';

import { MusicWallpaper } from '../MusicWallpaper';
import { ShareButton } from '../ShareButton';
import { SearchResults } from './SearchResults';
import { SelectedList } from './SelectedList';

import { DEFAULT_TITLE, MAX_TRACKS, MIN_TRACKS, TITLE_MAX } from '@/lib/params';
import type { Track } from '@/types/track';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

const SEARCH_DEBOUNCE_MS = 300;
const EMPTY: Track[] = [];

const deezerId = (track: Track) => track.id.replace('deezer:', '');

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(String(response.status));
  return response.json();
}

function useDebounced(value: string, delay: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

interface BuildWallpaperProps {
  initialTracks: Track[];
  initialTitle: string;
  showSpotifyNotice: boolean;
}

export function BuildWallpaper({
  initialTracks,
  initialTitle,
  showSpotifyNotice
}: BuildWallpaperProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<Track[]>(initialTracks);
  const [title, setTitle] = useState(initialTitle);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounced(query.trim(), SEARCH_DEBOUNCE_MS);

  const ids = useMemo(() => selected.map(deezerId), [selected]);
  const idsParam = ids.join(',');

  const search = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () =>
      getJson<Track[]>(`/api/search?q=${encodeURIComponent(debouncedQuery)}`),
    enabled: debouncedQuery.length >= 2,
    staleTime: 5 * 60 * 1000
  });

  const colored = useQuery({
    queryKey: ['tracks', idsParam],
    queryFn: () => getJson<Track[]>(`/api/tracks?ids=${idsParam}`),
    enabled: ids.length > 0,
    placeholderData: keepPreviousData
  });

  usePrefetchPreviews(search.data ?? EMPTY);

  const displayTracks = useMemo(() => {
    const colors = new Map(
      (colored.data ?? []).map((track) => [track.id, track.dominantColor])
    );
    return selected.map((track) => ({
      ...track,
      dominantColor: colors.get(track.id) ?? track.dominantColor
    }));
  }, [selected, colored.data]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (idsParam) params.set('t', idsParam);
    if (title && title !== DEFAULT_TITLE) params.set('title', title);
    const queryString = params.toString();
    router.replace(queryString ? `/montar?${queryString}` : '/montar', {
      scroll: false
    });
  }, [idsParam, title, router]);

  const full = selected.length >= MAX_TRACKS;
  const missing = MIN_TRACKS - selected.length;
  const shareTitle = title.trim() || DEFAULT_TITLE;

  const add = (track: Track) =>
    setSelected((current) =>
      current.length >= MAX_TRACKS ||
      current.some((item) => item.id === track.id)
        ? current
        : [...current, track]
    );

  const remove = (trackId: string) =>
    setSelected((current) => current.filter((track) => track.id !== trackId));

  const move = (index: number, offset: -1 | 1) =>
    setSelected((current) => {
      const next = [...current];
      const target = index + offset;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 md:flex-row md:items-start">
      <div className="flex w-full flex-col gap-5 md:max-w-md">
        {showSpotifyNotice && (
          <p
            role="status"
            className="rounded-xl border-2 border-black bg-white/60 p-4 font-semibold"
          >
            O Spotify só libera o Artfy para poucas contas por enquanto. Mas dá
            pra montar o seu escolhendo as músicas aqui.
          </p>
        )}

        <label className="flex flex-col gap-1 font-bold">
          Título
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value.toUpperCase())}
            maxLength={TITLE_MAX}
            placeholder={DEFAULT_TITLE}
            className="rounded-lg border-2 border-black bg-white px-3 py-2 font-extrabold uppercase"
          />
        </label>

        <label className="flex flex-col gap-1 font-bold">
          Buscar música ou artista
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ex.: Anitta, Envolver"
            className="rounded-lg border-2 border-black bg-white px-3 py-2"
          />
        </label>

        {search.isFetching && <p className="text-sm">Buscando…</p>}
        {search.isError && (
          <p role="alert" className="text-sm font-semibold">
            A busca falhou. Tente de novo.
          </p>
        )}
        {search.data && search.data.length === 0 && (
          <p className="text-sm">Nada encontrado para essa busca.</p>
        )}
        {search.data && search.data.length > 0 && (
          <SearchResults
            results={search.data}
            selectedIds={selected.map((track) => track.id)}
            full={full}
            onAdd={add}
          />
        )}

        {selected.length > 0 && (
          <div className="flex flex-col gap-2">
            <h2 className="font-extrabold">Suas músicas</h2>
            <SelectedList tracks={selected} onMove={move} onRemove={remove} />
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-4 md:sticky md:top-6 md:flex-1">
        <h1 className="text-outline text-center text-5xl font-extrabold">
          {shareTitle}
        </h1>
        {displayTracks.length > 0 ? (
          <MusicWallpaper tracks={displayTracks} eager prefetch />
        ) : (
          <div className="flex min-h-[20rem] w-80 items-center justify-center rounded-xl bg-black p-8 text-center font-bold text-white">
            Busque e adicione músicas para montar seu wallpaper
          </div>
        )}
        <p className="font-bold">
          {selected.length} de {MAX_TRACKS}
        </p>
        {missing > 0 && (
          <p className="text-sm font-semibold">
            Escolha mais {missing} para gerar a polaroid
          </p>
        )}
        <ShareButton
          href={`/api/share?tracks=${idsParam}&title=${encodeURIComponent(
            shareTitle
          )}`}
          fileName="artfy-meu-som.png"
          disabled={missing > 0}
        />
      </div>
    </div>
  );
}
