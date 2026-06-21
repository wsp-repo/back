import { ServiceError } from '@zalib/core';

/**
 * Исключение для сеттера свойств под декораторами
 */
export function throwSetter(): void {
  throw new ServiceError('Property not writable');
}
