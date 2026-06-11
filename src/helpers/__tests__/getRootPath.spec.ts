import { dirname } from 'path';

import { describe, it, expect } from 'vitest';

import { getRootPath } from '../getRootPath';

describe('Helpers checkers is...', () => {
  it('getRootPath', () => {
    // ручное поднятие по дереву
    const helpersPath = dirname(__dirname);
    const srcPath = dirname(helpersPath);
    const rootPath = dirname(srcPath);

    expect(getRootPath()).toEqual(rootPath);
  });
});
