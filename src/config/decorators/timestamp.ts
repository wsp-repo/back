/* eslint-disable @typescript-eslint/naming-convention */

import { Timestamp } from '@zalib/core';

import { ConfigTimestampOptions, getConfigTimestamp } from '../getters';
import { register } from './bootstrap';
import { throwSetter } from './helpers';

/**
 * Декоратор для чтения конфига
 */
export function ConfigTimestamp(
  path: string,
  options?: ConfigTimestampOptions,
): PropertyDecorator {
  return (target: object, propertyKey: string | symbol): void => {
    let value: Timestamp | undefined; // локальное хранение

    register(() => (value = getConfigTimestamp(path, options)));

    const attr = { get: () => value, set: throwSetter };

    Object.defineProperty(target, propertyKey, attr);
  };
}
