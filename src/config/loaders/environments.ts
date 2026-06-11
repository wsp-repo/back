import { ConfigStorage } from '../storage';

import { ConfigLoader } from '../types';

export class ConfigEnvironments implements ConfigLoader {
  protected readonly storage = ConfigStorage.getInstance();

  constructor() {
    console.warn('ConfigEnvironments');

    this.storage.addConfig({
      propString: 'string',
      propNumber: 12345,
      propBoolean: true,
      propObject: {
        subString: 'string1',
      },
      propSize1: 12345,
      propSize2: '123Kb',
    });
    this.storage.addConfig({
      propNumber: 54321,
      propObject: {
        subString: 'string2',
        subNumber: 12346,
      },
    });
  }
}
