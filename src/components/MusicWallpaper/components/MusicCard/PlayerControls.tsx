import { memo } from 'react';

export const PlayerControls = memo(function PlayerControls({
  playing
}: {
  playing: boolean;
}) {
  return (
    <svg
      viewBox="0 0 72 16"
      className="mx-auto block h-4 w-[4.5rem] text-white"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        d="M2 5h2.5l4 6H11M2 11h2.5l1.2-1.8M8.3 6.8 8.5 5H11"
        stroke="currentColor"
        strokeWidth="0.9"
        fill="none"
      />
      <path d="M19 4h1.5v8H19zM28 4v8l-7-4z" />
      <circle cx="36" cy="8" r="7" />
      {playing ? (
        <path d="M33.5 5h1.8v6h-1.8zM36.7 5h1.8v6h-1.8z" fill="#000" />
      ) : (
        <path d="M34 4.8v6.4L39.2 8z" fill="#000" />
      )}
      <path d="M51.5 4H53v8h-1.5zM44 4v8l7-4z" />
      <path
        d="M61 6h7l-1.5-1.5M69 10h-7l1.5 1.5"
        stroke="currentColor"
        strokeWidth="0.9"
        fill="none"
      />
    </svg>
  );
});
