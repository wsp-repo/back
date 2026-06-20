import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import {
  ConfigObject,
  addConfig,
  getValue,
  setReadyConfig,
  cleanConfig,
} from '../../storage';

const obj = {
  arr: [1, 2, 3],
  arr2: [{ o: 4, p: 5 }, { o: 6 }],
  bool: false,
  num: 7,
  obj: {
    num: 8,
    str: '9',
  },
  str: '0',
};

describe('Config', () => {
  describe('Storage', () => {
    beforeEach(() => {
      cleanConfig();
      addConfig(obj as ConfigObject);
    });

    afterEach(cleanConfig);

    it('getValue - not ready', () => {
      expect(() => getValue('arr')).throw();
    });

    it('getValue - ready', () => {
      setReadyConfig();

      expect(getValue('arr.1')).toStrictEqual(obj.arr[1]);
      expect(getValue('arr2.0.o')).toStrictEqual(obj.arr2[0].o);
      expect(getValue('arr2.1')).toStrictEqual(obj.arr2[1]);
    });
  });
});
