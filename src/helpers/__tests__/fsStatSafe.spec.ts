import { resolve } from 'path';

import { describe, it, expect } from 'vitest';

import { fsStatSafe } from '../fsStatSafe';

describe('Helpers checkers is...', () => {
  it('fsStatSafe', () => {
    expect(fsStatSafe(__filename)?.isFile()).toBe(true);
    expect(fsStatSafe(__dirname)?.isDirectory()).toBe(true);

    const throwPath = resolve(__dirname, 'throwDir');
    expect(fsStatSafe(throwPath)).toBeNull();
  });
});
