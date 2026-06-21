import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { ConfigValueError } from '../../errors';
import { getConfigString } from '../../getters';
import {
  ConfigObject,
  addConfig,
  cleanConfig,
  setReadyConfig,
} from '../../storage';

const config: ConfigObject = {
  converted: 42,
  invalid: '',
  value: 'text',
};

describe('Config', () => {
  describe('Getters', () => {
    describe('getConfigString', () => {
      beforeEach(() => {
        cleanConfig();
        addConfig(config);
        setReadyConfig();
      });

      afterEach(cleanConfig);

      it('returns string value', () => {
        expect(getConfigString('value')).toBe('text');
      });

      it('converts number value to string', () => {
        expect(getConfigString('converted')).toBe('42');
      });

      it('returns undefined for missing optional value', () => {
        expect(getConfigString('missing', { optional: true })).toBeUndefined();
      });

      it('throws for invalid value', () => {
        expect(() => getConfigString('invalid')).toThrow(ConfigValueError);
      });
    });
  });
});
