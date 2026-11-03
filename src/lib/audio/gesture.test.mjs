import assert from 'node:assert/strict';
import { test } from 'node:test';

import { fadeVolume, isHoldCancelled, previewSrc } from './gesture.ts';

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
