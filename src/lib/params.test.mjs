import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  parsePeriod,
  parsePreviewKey,
  parseShareParams,
  parseTitle,
  parseTrackIds
} from './params.ts';

test('parsePeriod aceita só os três períodos', () => {
  assert.equal(parsePeriod('short_term'), 'short_term');
  assert.equal(parsePeriod('weekly'), null);
  assert.equal(parsePeriod(null), null);
});

test('parseTrackIds valida formato, duplicados e limites', () => {
  assert.deepEqual(parseTrackIds('1,22,333'), ['1', '22', '333']);
  assert.equal(parseTrackIds('1,abc'), null);
  assert.equal(parseTrackIds('1,1'), null);
  assert.equal(
    parseTrackIds(Array.from({ length: 17 }, (_, i) => i + 1).join(',')),
    null
  );
  assert.equal(parseTrackIds('1,2,3', { min: 9 }), null);
  assert.equal(parseTrackIds('http://evil/1'), null);
  assert.equal(parseTrackIds(''), null);
  assert.equal(parseTrackIds(null), null);
});

test('parseTitle normaliza e limita', () => {
  assert.equal(parseTitle('  meu novembro '), 'MEU NOVEMBRO');
  assert.equal(parseTitle('a'.repeat(30)).length, 14);
  assert.equal(parseTitle(''), 'MEU SOM');
  assert.equal(parseTitle(null), 'MEU SOM');
});

test('parsePreviewKey', () => {
  assert.deepEqual(parsePreviewKey('isrc:QRVEB2600067'), {
    source: 'isrc',
    isrc: 'QRVEB2600067'
  });
  assert.deepEqual(parsePreviewKey('deezer:4337389322'), {
    source: 'deezer',
    id: '4337389322'
  });
  assert.equal(parsePreviewKey('isrc:../../x'), null);
  assert.equal(parsePreviewKey('spotify:123'), null);
});

test('parseShareParams', () => {
  assert.deepEqual(parseShareParams(new URLSearchParams('period=long_term')), {
    kind: 'period',
    period: 'long_term'
  });
  assert.deepEqual(parseShareParams(new URLSearchParams('chart=brasil')), {
    kind: 'chart'
  });
  const ids = Array.from({ length: 9 }, (_, i) => i + 1).join(',');
  assert.equal(
    parseShareParams(new URLSearchParams(`tracks=${ids}&title=oi`)).title,
    'OI'
  );
  assert.equal(parseShareParams(new URLSearchParams('tracks=1,2,3')), null);
  assert.equal(parseShareParams(new URLSearchParams('')), null);
});
