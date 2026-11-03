'use client';
import { useAudioPreview } from './AudioPreviewProvider';

export function SoundToggle() {
  const { soundEnabled, needsActivation, toggleSound } = useAudioPreview();
  const label = needsActivation
    ? 'Toque para ouvir'
    : soundEnabled
    ? 'Desativar som'
    : 'Ativar som';

  return (
    <button
      type="button"
      onClick={toggleSound}
      aria-pressed={soundEnabled}
      aria-label={label}
      title={label}
      className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-black/85 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-300 ${
        needsActivation ? 'motion-safe:animate-pulse' : ''
      }`}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M11 5 6 9H2v6h4l5 4V5z" fill="currentColor" />
        {soundEnabled ? (
          <>
            <path d="M15.5 8.5a5 5 0 0 1 0 7" />
            <path d="M19 5a10 10 0 0 1 0 14" />
          </>
        ) : (
          <>
            <path d="m22 9-6 6" />
            <path d="m16 9 6 6" />
          </>
        )}
      </svg>
      <span className="hidden sm:inline">
        {needsActivation
          ? 'Toque para ouvir'
          : soundEnabled
          ? 'Som ligado'
          : 'Ativar som'}
      </span>
    </button>
  );
}
