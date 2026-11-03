import type { Track } from '@/types/track';

interface SelectedListProps {
  tracks: Track[];
  onMove(index: number, offset: -1 | 1): void;
  onRemove(trackId: string): void;
}

export function SelectedList({ tracks, onMove, onRemove }: SelectedListProps) {
  return (
    <ol className="flex flex-col gap-1">
      {tracks.map((track, index) => (
        <li
          key={track.id}
          className="flex items-center gap-2 rounded-lg bg-white/40 px-2 py-1.5"
        >
          <span className="w-6 text-center text-sm font-extrabold">
            {index + 1}
          </span>
          <p className="min-w-0 flex-1 truncate text-sm font-semibold">
            {track.name} · {track.artists.join(', ')}
          </p>
          <button
            type="button"
            onClick={() => onMove(index, -1)}
            disabled={index === 0}
            aria-label={`Subir ${track.name}`}
            className="h-7 w-7 rounded-full font-bold hover:bg-black/10 disabled:opacity-30"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={() => onMove(index, 1)}
            disabled={index === tracks.length - 1}
            aria-label={`Descer ${track.name}`}
            className="h-7 w-7 rounded-full font-bold hover:bg-black/10 disabled:opacity-30"
          >
            ↓
          </button>
          <button
            type="button"
            onClick={() => onRemove(track.id)}
            aria-label={`Remover ${track.name}`}
            className="h-7 w-7 rounded-full font-bold hover:bg-black/10"
          >
            ×
          </button>
        </li>
      ))}
    </ol>
  );
}
