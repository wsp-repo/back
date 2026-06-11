import { getAppData } from './getAppData';

/**
 * Возвращает имя приложения
 */
export function getAppName(): string {
  return getAppData().name || 'unknown';
}
