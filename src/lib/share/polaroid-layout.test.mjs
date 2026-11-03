import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  SAFE_TOP,
  STORY_W,
  TITLE_MAX_WIDTH,
  polaroidLayout,
  titleFontSize,
  truncate
} from './polaroid-layout.ts';

test('polaroidLayout respeita a faixa segura e o limite de 9', () => {
  for (const count of [0, 4, 9, 16]) {
    const slots = polaroidLayout(count);
    assert.equal(slots.length, Math.min(count, 9));
    for (const slot of slots) {
      assert.ok(slot.y >= SAFE_TOP);
      assert.ok(slot.x >= 0 && slot.x + slot.size <= STORY_W);
    }
  }
});

test('a nº 1 é a maior e fica por cima', () => {
  const slots = polaroidLayout(9);
  assert.ok(slots.every((slot, i) => i === 0 || slot.size < slots[0].size));
  assert.ok(slots.every((slot, i) => i === 0 || slot.z < slots[0].z));
});

test('truncate com acento e emoji', () => {
  assert.equal(truncate('Coração', 20), 'Coração');
  assert.equal(truncate('Uma música muito longa demais', 10), 'Uma músic…');
  assert.equal(Array.from(truncate('🎵🎵🎵🎵', 3)).length, 3);
});

test('titleFontSize cabe na largura útil', () => {
  assert.equal(titleFontSize('MEU MÊS'), 120);
  assert.ok(titleFontSize('WWWWWWWWWWWWWW') * 14 * 0.95 <= TITLE_MAX_WIDTH);
  assert.ok(titleFontSize('O BRASIL AGORA') >= 85);
});
