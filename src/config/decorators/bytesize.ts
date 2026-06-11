/* eslint-disable @typescript-eslint/naming-convention */

import { ByteSize } from '@zalib/core';

import { ConfigByteSizeOptions, getConfigByteSize } from '../getters';
import { register } from './bootstrap';
import { throwSetter } from './helpers';

/**
 * Декоратор для чтения конфига
 */
export function ConfigByteSize(
  path: string,
  options?: ConfigByteSizeOptions,
): PropertyDecorator {
  return (target: object, propertyKey: string | symbol): void => {
    let value: ByteSize | undefined; // локальное хранение

    register(() => (value = getConfigByteSize(path, options)));

    const attr = { get: () => value, set: throwSetter };

    Object.defineProperty(target, propertyKey, attr);
  };
}
