export type Period = 'short_term' | 'medium_term' | 'long_term';

export const PERIODS: readonly Period[] = [
  'short_term',
  'medium_term',
  'long_term'
];

export const PERIOD_LABEL: Record<Period, string> = {
  short_term: 'Mês',
  medium_term: 'Semestre',
  long_term: 'Ano'
};

export const PERIOD_TITLE: Record<Period, string> = {
  short_term: 'MEU MÊS',
  medium_term: 'MEU SEMESTRE',
  long_term: 'MEU ANO'
};

export const PERIOD_SLUG: Record<Period, string> = {
  short_term: 'mes',
  medium_term: 'semestre',
  long_term: 'ano'
};

export const MIN_TRACKS = 9;
export const MAX_TRACKS = 16;
export const TITLE_MAX = 14;
export const DEFAULT_TITLE = 'MEU SOM';

const TRACK_ID = /^\d{1,12}$/;
const ISRC = /^[A-Z]{2}[A-Z0-9]{3}\d{7}$/;

export function parsePeriod(value: string | null): Period | null {
  return PERIODS.find((period) => period === value) ?? null;
}

export function parseTrackIds(
  value: string | null,
  { min = 1, max = MAX_TRACKS }: { min?: number; max?: number } = {}
): string[] | null {
  if (!value) return null;
  const ids = value.split(',');
  if (ids.length < min || ids.length > max) return null;
  if (!ids.every((id) => TRACK_ID.test(id))) return null;
  if (new Set(ids).size !== ids.length) return null;
  return ids;
}

export function parseTitle(value: string | null): string {
  const title = Array.from((value ?? '').trim().toUpperCase())
    .slice(0, TITLE_MAX)
    .join('')
    .trim();
  return title || DEFAULT_TITLE;
}

export type PreviewKey =
  | { source: 'isrc'; isrc: string }
  | { source: 'deezer'; id: string };

export function parsePreviewKey(key: string): PreviewKey | null {
  const [source, value = ''] = key.split(/:(.*)/);
  if (source === 'isrc' && ISRC.test(value)) return { source, isrc: value };
  if (source === 'deezer' && TRACK_ID.test(value)) return { source, id: value };
  return null;
}

export type ShareRequest =
  | { kind: 'period'; period: Period }
  | { kind: 'custom'; ids: string[]; title: string }
  | { kind: 'chart' };

export function parseShareParams(params: URLSearchParams): ShareRequest | null {
  const period = parsePeriod(params.get('period'));
  if (period) return { kind: 'period', period };

  if (params.get('chart') === 'brasil') return { kind: 'chart' };

  const ids = parseTrackIds(params.get('tracks'), { min: MIN_TRACKS });
  if (ids)
    return { kind: 'custom', ids, title: parseTitle(params.get('title')) };

  return null;
}
