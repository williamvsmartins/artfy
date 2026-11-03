import assert from 'node:assert/strict';
import { test } from 'node:test';

import { mixHex } from './color.ts';

test('mixHex mistura pelo peso do primeiro', () => {
  assert.equal(mixHex('#000000', '#ffffff', 0.5), '#808080');
  assert.equal(mixHex('#FF0000', '#0000ff', 1), '#ff0000');
  assert.equal(mixHex('#FF0000', '#0000ff', 0), '#0000ff');
});
