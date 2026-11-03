import assert from 'node:assert/strict';
import { test } from 'node:test';

import { PREVIEW_CACHE_CONTROL, resolvePreviewUrl } from './resolve-preview.ts';

const none = async () => null;

test('deezer id primeiro', async () => {
  assert.equal(
    await resolvePreviewUrl({ source: 'deezer', id: '1' }, null, {
      byDeezerId: async () => 'dz',
      byIsrc: none,
      byItunes: none
    }),
    'dz'
  );
});

test('isrc consulta o deezer pelo isrc', async () => {
  assert.equal(
    await resolvePreviewUrl({ source: 'isrc', isrc: 'QRVEB2600067' }, 'a b', {
      byDeezerId: none,
      byIsrc: async (isrc) => (isrc === 'QRVEB2600067' ? 'dz' : null),
      byItunes: async () => 'it'
    }),
    'dz'
  );
});

test('isrc cai no itunes quando o deezer não tem', async () => {
  assert.equal(
    await resolvePreviewUrl({ source: 'isrc', isrc: 'QRVEB2600067' }, 'a b', {
      byDeezerId: none,
      byIsrc: none,
      byItunes: async (term) => (term === 'a b' ? 'it' : null)
    }),
    'it'
  );
});

test('sem termo não consulta o itunes e devolve null', async () => {
  let called = false;
  assert.equal(
    await resolvePreviewUrl({ source: 'isrc', isrc: 'QRVEB2600067' }, null, {
      byDeezerId: none,
      byIsrc: none,
      byItunes: async () => {
        called = true;
        return 'x';
      }
    }),
    null
  );
  assert.equal(called, false);
});

test('cache menor que a validade do preview', () => {
  assert.equal(PREVIEW_CACHE_CONTROL, 'public, s-maxage=300');
});
