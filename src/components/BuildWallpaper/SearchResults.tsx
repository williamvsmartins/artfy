'use client';
import { usePreviewGesture } from '@/components/AudioPreview/usePreviewGesture';

import type { Track } from '@/types/track';

interface SearchResultProps {
  track: Track;
  selected: boolean;
  full: boolean;
  onAdd(track: Track): void;
}

function SearchResult({ track, selected, full, onAdd }: SearchResultProps) {
  const gesture = usePreviewGesture(track);

  return (
    <li
      {...gesture}
      className="flex select-none items-center gap-3 rounded-lg p-2 transition-colors hover:bg-black/10 data-[active=true]:bg-black/10"
    >
      {track.coverSmall && (
        <img
          src={track.coverSmall}
          alt=""
          width={48}
          height={48}
          loading="lazy"
          draggable={false}
          className="h-12 w-12 shrink-0 rounded object-cover"
        />
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate font-bold">{track.name}</p>
        <p className="truncate text-sm">{track.artists.join(', ')}</p>
      </div>
      <button
        type="button"
        onClick={() => onAdd(track)}
        disabled={selected || full}
        className="shrink-0 rounded-full bg-black px-3 py-1.5 text-sm font-bold text-[#FFE818] disabled:opacity-40"
      >
        {selected ? 'Adicionada' : 'Adicionar'}
      </button>
    </li>
  );
}

interface SearchResultsProps {
  results: Track[];
  selectedIds: string[];
  full: boolean;
  onAdd(track: Track): void;
}

export function SearchResults({
  results,
  selectedIds,
  full,
  onAdd
}: SearchResultsProps) {
  return (
    <ul className="flex flex-col gap-1">
      {results.map((track) => (
        <SearchResult
          key={track.id}
          track={track}
          selected={selectedIds.includes(track.id)}
          full={full}
          onAdd={onAdd}
        />
      ))}
    </ul>
  );
}
