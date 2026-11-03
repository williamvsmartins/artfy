import assert from 'node:assert/strict';
import { test } from 'node:test';

import { fromDeezer, fromSpotify } from './mappers.ts';

test('fromSpotify usa imagens por tamanho e isrc', () => {
  const track = fromSpotify({
    id: 'a',
    name: 'Song',
    artists: [{ name: 'X' }, { name: 'Y' }],
    album: { images: [{ url: 'L' }, { url: 'M' }, { url: 'S' }] },
    external_ids: { isrc: 'QRVEB2600067' }
  });
  assert.deepEqual(track, {
    id: 'spotify:a',
    name: 'Song',
    artists: ['X', 'Y'],
    coverLarge: 'L',
    coverSmall: 'M',
    coverThumb: 'S',
    dominantColor: null,
    previewKey: 'isrc:QRVEB2600067'
  });
});

test('fromSpotify sem isrc nem imagens', () => {
  const track = fromSpotify({
    id: 'a',
    name: 'S',
    artists: [],
    album: { images: [] }
  });
  assert.equal(track.previewKey, null);
  assert.equal(track.coverSmall, null);
  assert.equal(track.coverLarge, null);
  assert.equal(track.coverThumb, null);
});

test('fromDeezer', () => {
  const track = fromDeezer({
    id: 42,
    title: 'T',
    artist: { name: 'A' },
    album: { cover_small: 's', cover_medium: 'm', cover_xl: 'xl' },
    preview: 'p'
  });
  assert.deepEqual(track, {
    id: 'deezer:42',
    name: 'T',
    artists: ['A'],
    coverLarge: 'xl',
    coverSmall: 'm',
    coverThumb: 's',
    dominantColor: null,
    previewKey: 'deezer:42'
  });
});
