/* eslint-disable @typescript-eslint/naming-convention */

import { ConfigBooleanOptions, getConfigBoolean } from '../getters';
import { register } from './bootstrap';
import { throwSetter } from './helpers';

/**
 * Декоратор для чтения конфига
 */
export function ConfigBoolean(
  path: string,
  options?: ConfigBooleanOptions,
): PropertyDecorator {
  return (target: object, propertyKey: string | symbol): void => {
    let value: boolean | undefined; // локальное хранение

    register(() => (value = getConfigBoolean(path, options)));

    const attr = { get: () => value, set: throwSetter };

    Object.defineProperty(target, propertyKey, attr);
  };
}
