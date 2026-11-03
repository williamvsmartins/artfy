'use client';
import { useState } from 'react';

interface ShareButtonProps {
  href: string;
  fileName: string;
  disabled?: boolean;
}

type ShareStatus = 'idle' | 'generating' | 'error';

function download(file: File) {
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = file.name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function ShareButton({ href, fileName, disabled }: ShareButtonProps) {
  const [status, setStatus] = useState<ShareStatus>('idle');

  const share = async () => {
    setStatus('generating');
    try {
      const response = await fetch(href);
      if (!response.ok) throw new Error(String(response.status));
      const file = new File([await response.blob()], fileName, {
        type: 'image/png'
      });

      if (navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file] });
        } catch (error) {
          if (!(error instanceof DOMException && error.name === 'AbortError')) {
            download(file);
          }
        }
      } else {
        download(file);
      }
      setStatus('idle');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={share}
        disabled={disabled || status === 'generating'}
        className="flex items-center gap-2 rounded-full bg-black px-6 py-3 font-bold text-[#FFE818] shadow-lg transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 motion-reduce:transition-none"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 3v12M7 8l5-5 5 5M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" />
        </svg>
        {status === 'generating' ? 'Gerando…' : 'Postar no story'}
      </button>
      {status === 'error' && (
        <p role="alert" className="text-sm font-semibold">
          Não deu pra gerar a imagem. Tente de novo.
        </p>
      )}
    </div>
  );
}
