import { TString, Type } from '@zalib/core';

import { ConfigValueOptions, getConfigValue } from './value';

const defaultStringSchema = Type.String();

export type ConfigStringOptions = Partial<ConfigValueOptions<TString>>;

export function getConfigString(
  path: string,
  options?: ConfigStringOptions,
): string | undefined {
  const getOptions: ConfigValueOptions<TString> = {
    schema: defaultStringSchema,
    ...options,
  };

  return getConfigValue(path, getOptions);
}
