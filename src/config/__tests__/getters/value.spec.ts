import { Type } from '@zalib/core';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { ConfigValueError } from '../../errors';
import { getConfigValue } from '../../getters';
import {
  ConfigObject,
  addConfig,
  cleanConfig,
  getValue,
  setReadyConfig,
} from '../../storage';

const config: ConfigObject = {
  converted: {
    count: '2',
    name: 'test',
  },
  invalid: {
    count: 'not-number',
    name: 'test',
  },
  value: {
    count: 2,
    extra: true,
    name: 'test',
  },
};

const schema = Type.Object({
  count: Type.Number(),
  name: Type.String(),
});

describe('Config', () => {
  describe('Getters', () => {
    describe('getConfigValue', () => {
      beforeEach(() => {
        cleanConfig();
        addConfig(config);
        setReadyConfig();
      });

      afterEach(cleanConfig);

      it('returns value validated by custom schema', () => {
        expect(getConfigValue('value', { schema })).toStrictEqual({
          count: 2,
          name: 'test',
        });

        expect(getValue('value')).toStrictEqual(config.value);
      });

      it('converts value according to custom schema', () => {
        expect(getConfigValue('converted', { schema })).toStrictEqual({
          count: 2,
          name: 'test',
        });

        expect(getValue('converted')).toStrictEqual(config.converted);
      });

      it('returns undefined for missing optional value', () => {
        expect(
          getConfigValue('missing', { optional: true, schema }),
        ).toBeUndefined();
      });

      it('throws for invalid value', () => {
        expect(() => getConfigValue('invalid', { schema })).toThrow(
          ConfigValueError,
        );
      });
    });
  });
});
