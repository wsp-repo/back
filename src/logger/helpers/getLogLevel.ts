import { LogLevels } from '../types';

import { LOG_LEVELS_KEYS } from '../constants';

/**
 * Возвращает числовое значение для опции уровня логов
 */
export function getLogLevel(logLevel?: LogLevels): LogLevels {
  if (logLevel) return logLevel;

  const envLogLevel = process.env.LOG_LEVEL?.toLowerCase();

  if (envLogLevel && LOG_LEVELS_KEYS.includes(envLogLevel)) {
    return envLogLevel as LogLevels;
  }

  return LogLevels.Info;
}
