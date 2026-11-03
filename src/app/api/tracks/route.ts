import { NextResponse } from 'next/server';

import { parseTrackIds } from '@/lib/params';
import { getTracksByIds } from '@/lib/tracks/catalog';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const ids = parseTrackIds(new URL(request.url).searchParams.get('ids'));
  if (!ids)
    return NextResponse.json({ error: 'ids inválidos' }, { status: 400 });

  return NextResponse.json(await getTracksByIds(ids));
}
