import { describe, it, expect } from 'vitest';

import { ConfigStorage } from '../../storage';

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

describe('ConfigStorage', () => {
  new ConfigStorage();

  const storage = ConfigStorage.getInstance();

  storage.addConfig(obj);

  it('getValue', () => {
    expect(storage.getValue('arr.1')).toStrictEqual(obj.arr[1]);
    expect(storage.getValue('arr2.0.o')).toStrictEqual(obj.arr2[0].o);
    expect(storage.getValue('arr2.1')).toStrictEqual(obj.arr2[1]);
  });
});
