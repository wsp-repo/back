import { Timestamp, TTimestamp, Type } from '@zalib/core';

import { ConfigValueOptions, getConfigValue } from './value';

const defaultTimestampSchema = Type.Timestamp();

export type ConfigTimestampOptions = Partial<ConfigValueOptions<TTimestamp>>;

export function getConfigTimestamp(
  path: string,
  options?: ConfigTimestampOptions,
): Timestamp | undefined {
  const getOptions: ConfigValueOptions<TTimestamp> = {
    schema: defaultTimestampSchema,
    ...options,
  };

  return getConfigValue(path, getOptions);
}
