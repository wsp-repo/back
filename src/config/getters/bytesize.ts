import { ByteSize, TByteSize, Type } from '@zalib/core';

import { ConfigValueOptions, getConfigValue } from './value';

const defaultByteSizeSchema = Type.ByteSize();

export type ConfigByteSizeOptions = Partial<ConfigValueOptions<TByteSize>>;

export function getConfigByteSize(
  path: string,
  options?: ConfigByteSizeOptions,
): ByteSize | undefined {
  const getOptions: ConfigValueOptions<TByteSize> = {
    schema: defaultByteSizeSchema,
    ...options,
  };

  return getConfigValue(path, getOptions);
}
