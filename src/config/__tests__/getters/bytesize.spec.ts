import { ByteSize } from '@zalib/core';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { ConfigValueError } from '../../errors';
import { getConfigByteSize } from '../../getters';
import {
  ConfigObject,
  addConfig,
  cleanConfig,
  setReadyConfig,
} from '../../storage';

const config: ConfigObject = {
  converted: '1Kb',
  invalid: 'wrong',
  value: 1024,
};

describe('Config', () => {
  describe('Getters', () => {
    describe('getConfigByteSize', () => {
      beforeEach(() => {
        cleanConfig();
        addConfig(config);
        setReadyConfig();
      });

      afterEach(cleanConfig);

      it('returns ByteSize value', () => {
        const value = getConfigByteSize('value');

        expect(value).toBeInstanceOf(ByteSize);
        expect(value?.toBytes()).toBe(1024);
      });

      it('converts string value to ByteSize', () => {
        const value = getConfigByteSize('converted');

        expect(value).toBeInstanceOf(ByteSize);
        expect(value?.toBytes()).toBe(1024);
      });

      it('returns undefined for missing optional value', () => {
        expect(
          getConfigByteSize('missing', { optional: true }),
        ).toBeUndefined();
      });

      it('throws for invalid value', () => {
        expect(() => getConfigByteSize('invalid')).toThrow(ConfigValueError);
      });
    });
  });
});
