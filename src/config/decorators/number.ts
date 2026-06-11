/* eslint-disable @typescript-eslint/naming-convention */

import { ConfigNumberOptions, getConfigNumber } from '../getters';
import { register } from './bootstrap';
import { throwSetter } from './helpers';

/**
 * Декоратор для чтения конфига
 */
export function ConfigNumber(
  path: string,
  options?: ConfigNumberOptions,
): PropertyDecorator {
  return (target: object, propertyKey: string | symbol): void => {
    let value: number | undefined; // локальное хранение

    register(() => (value = getConfigNumber(path, options)));

    const attr = { get: () => value, set: throwSetter };

    Object.defineProperty(target, propertyKey, attr);
  };
}
