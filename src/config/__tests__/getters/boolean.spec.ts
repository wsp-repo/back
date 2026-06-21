import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { ConfigValueError } from '../../errors';
import { getConfigBoolean } from '../../getters';
import {
  ConfigObject,
  addConfig,
  cleanConfig,
  setReadyConfig,
} from '../../storage';

const config: ConfigObject = {
  converted: 'true',
  invalid: 'not-boolean',
  value: true,
};

describe('Config', () => {
  describe('Getters', () => {
    describe('getConfigBoolean', () => {
      beforeEach(() => {
        cleanConfig();
        addConfig(config);
        setReadyConfig();
      });

      afterEach(cleanConfig);

      it('returns boolean value', () => {
        expect(getConfigBoolean('value')).toBe(true);
      });

      it('converts string value to boolean', () => {
        expect(getConfigBoolean('converted')).toBe(true);
      });

      it('returns undefined for missing optional value', () => {
        expect(getConfigBoolean('missing', { optional: true })).toBeUndefined();
      });

      it('throws for invalid value', () => {
        expect(() => getConfigBoolean('invalid')).toThrow(ConfigValueError);
      });
    });
  });
});
