import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  HOVER_INTENT_MS,
  LEAVE_GRACE_MS,
  fadeVolume,
  hoverDelay,
  isHoldCancelled,
  pendingSources,
  previewSrc
} from './gesture.ts';

test('fadeVolume é linear e limitado', () => {
  assert.equal(fadeVolume(0, 300, 0, 1), 0);
  assert.equal(fadeVolume(150, 300, 0, 1), 0.5);
  assert.equal(fadeVolume(900, 300, 1, 0), 0);
  assert.equal(fadeVolume(-10, 300, 0, 1), 0);
});

test('isHoldCancelled a partir de 10 px', () => {
  assert.equal(isHoldCancelled(3, 4), false);
  assert.equal(isHoldCancelled(0, 10), false);
  assert.equal(isHoldCancelled(0, 11), true);
});

test('previewSrc', () => {
  assert.equal(
    previewSrc({ previewKey: 'deezer:1', artists: ['Anitta'], name: 'Envolver' }),
    '/api/preview/deezer:1?q=Anitta%20Envolver'
  );
  assert.equal(previewSrc({ previewKey: null, artists: [], name: 'x' }), null);
});

test('hoverDelay troca rápido quando algo já toca', () => {
  assert.equal(hoverDelay(false), HOVER_INTENT_MS);
  assert.ok(hoverDelay(true) < HOVER_INTENT_MS);
  assert.ok(LEAVE_GRACE_MS > hoverDelay(true));
});

test('pendingSources ignora repetidos e já conhecidos', () => {
  assert.deepEqual(pendingSources(['a', 'b', 'a', null, 'c'], new Set(['b'])), [
    'a',
    'c'
  ]);
});
