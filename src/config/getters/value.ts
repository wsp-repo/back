import {
  TSchema,
  createValidator,
  deepClone,
  isUndefined,
  StaticDecode,
} from '@zalib/core';

import { ConfigValueError } from '../errors';
import { getValue } from '../storage';

export type ConfigValueOptions<Schema extends TSchema> = {
  optional?: boolean;
  schema: Schema;
};

/**
 * Валидирует значение и формирует ошибку конфига
 */
function validateValue<Schema extends TSchema>(
  value: unknown,
  schema: Schema,
  path: string,
): StaticDecode<Schema> | undefined {
  const validator = createValidator(schema, {
    clean: true,
    convert: true,
    decode: true,
    defaults: true,
  });

  try {
    const result = validator.compile(deepClone(value));

    return result === null ? undefined : result;
  } catch (error) {
    throw new ConfigValueError(path, error);
  }
}

/**
 * Возвращает валидированное значение конфига
 */
export function getConfigValue<Schema extends TSchema>(
  path: string,
  options: ConfigValueOptions<Schema>,
): StaticDecode<Schema> | undefined {
  const { optional, schema } = options;

  const value = getValue(path);

  if (isUndefined(value) && optional) return undefined;

  return validateValue(value, schema, path);
}
