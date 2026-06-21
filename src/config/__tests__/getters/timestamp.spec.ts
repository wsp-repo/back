import { Timestamp } from '@zalib/core';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { ConfigValueError } from '../../errors';
import { getConfigTimestamp } from '../../getters';
import {
  ConfigObject,
  addConfig,
  cleanConfig,
  setReadyConfig,
} from '../../storage';

const config: ConfigObject = {
  converted: '1h',
  invalid: 'wrong',
  value: 3_600_000,
};

describe('Config', () => {
  describe('Getters', () => {
    describe('getConfigTimestamp', () => {
      beforeEach(() => {
        cleanConfig();
        addConfig(config);
        setReadyConfig();
      });

      afterEach(cleanConfig);

      it('returns Timestamp value', () => {
        const value = getConfigTimestamp('value');

        expect(value).toBeInstanceOf(Timestamp);
        expect(value?.toMs()).toBe(3_600_000);
      });

      it('converts string value to Timestamp', () => {
        const value = getConfigTimestamp('converted');

        expect(value).toBeInstanceOf(Timestamp);
        expect(value?.toMs()).toBe(3_600_000);
      });

      it('returns undefined for missing optional value', () => {
        expect(
          getConfigTimestamp('missing', { optional: true }),
        ).toBeUndefined();
      });

      it('throws for invalid value', () => {
        expect(() => getConfigTimestamp('invalid')).toThrow(ConfigValueError);
      });
    });
  });
});
