import { NextResponse } from 'next/server';

import { searchDeezer } from '@/lib/deezer';
import { fromDeezer } from '@/lib/tracks/mappers';

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get('q')?.trim() ?? '';
  if (query.length < 2 || query.length > 60) {
    return NextResponse.json({ error: 'busca inválida' }, { status: 400 });
  }

  const tracks = await searchDeezer(query);
  return NextResponse.json(tracks.map(fromDeezer));
}
