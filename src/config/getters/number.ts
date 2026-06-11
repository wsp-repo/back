import { TNumber, Type } from '@zalib/core';

import { ConfigValueOptions, getConfigValue } from './value';

const defaultNumberSchema = Type.Number();

export type ConfigNumberOptions = Partial<ConfigValueOptions<TNumber>>;

export function getConfigNumber(
  path: string,
  options?: ConfigNumberOptions,
): number | undefined {
  const getOptions: ConfigValueOptions<TNumber> = {
    schema: defaultNumberSchema,
    ...options,
  };

  return getConfigValue(path, getOptions);
}
