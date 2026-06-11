import { describe, it, expect } from 'vitest';

import { getAppData } from '../getAppData';

describe('Helper appData', () => {
  it('- object defined', () => {
    expect(getAppData()).toBeDefined();
  });

  it('- not mutable', () => {
    expect(() => {
      const appData = getAppData();

      appData.name = 'newValue';
    }).toThrow();
  });
});
