import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { ConfigValueError } from '../../errors';
import { getConfigNumber } from '../../getters';
import {
  ConfigObject,
  addConfig,
  cleanConfig,
  setReadyConfig,
} from '../../storage';

const config: ConfigObject = {
  converted: '42',
  invalid: 'not-number',
  value: 42,
};

describe('Config', () => {
  describe('Getters', () => {
    describe('getConfigNumber', () => {
      beforeEach(() => {
        cleanConfig();
        addConfig(config);
        setReadyConfig();
      });

      afterEach(cleanConfig);

      it('returns number value', () => {
        expect(getConfigNumber('value')).toBe(42);
      });

      it('converts string value to number', () => {
        expect(getConfigNumber('converted')).toBe(42);
      });

      it('returns undefined for missing optional value', () => {
        expect(getConfigNumber('missing', { optional: true })).toBeUndefined();
      });

      it('throws for invalid value', () => {
        expect(() => getConfigNumber('invalid')).toThrow(ConfigValueError);
      });
    });
  });
});
