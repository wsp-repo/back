import { TypeboxOptions } from '@zalib/core/typebox';

/**
 * Хелпер для добавления опции конвертации
 */
export function addConvert(options?: TypeboxOptions): TypeboxOptions {
  return { convert: true, ...options };
}
