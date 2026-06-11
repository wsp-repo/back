/* eslint-disable @typescript-eslint/naming-convention */

import { StaticDecode, TSchema } from '@zalib/core';

import { ConfigValueOptions, getConfigValue } from '../getters/value';
import { register } from './bootstrap';
import { throwSetter } from './helpers';

/**
 * Декоратор для чтения конфига
 */
export function ConfigValue<Schema extends TSchema>(
  path: string,
  options: ConfigValueOptions<Schema>,
): PropertyDecorator {
  return (target: object, propertyKey: string | symbol): void => {
    let value: StaticDecode<Schema> | undefined; // локальное хранение

    register(() => (value = getConfigValue(path, options)));

    const attr = { get: () => value, set: throwSetter };

    Object.defineProperty(target, propertyKey, attr);
  };
}
