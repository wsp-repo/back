/* eslint-disable @typescript-eslint/naming-convention */

import { ConfigStringOptions, getConfigString } from '../getters';
import { register } from './bootstrap';
import { throwSetter } from './helpers';

/**
 * Декоратор для чтения конфига
 */
export function ConfigString(
  path: string,
  options?: ConfigStringOptions,
): PropertyDecorator {
  return (target: object, propertyKey: string | symbol): void => {
    let value: string | undefined; // локальное хранение

    register(() => (value = getConfigString(path, options)));

    const attr = { get: () => value, set: throwSetter };

    Object.defineProperty(target, propertyKey, attr);
  };
}
