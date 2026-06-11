import { TBoolean, Type } from '@zalib/core';

import { ConfigValueOptions, getConfigValue } from './value';

const defaultBooleanSchema = Type.Boolean();

export type ConfigBooleanOptions = Partial<ConfigValueOptions<TBoolean>>;

export function getConfigBoolean(
  path: string,
  options?: ConfigBooleanOptions,
): boolean | undefined {
  const getOptions: ConfigValueOptions<TBoolean> = {
    schema: defaultBooleanSchema,
    ...options,
  };

  return getConfigValue(path, getOptions);
}
