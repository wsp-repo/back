import { LogFormats } from '../types';

import { LOG_FORMATS_KEYS } from '../constants';

/**
 * Возвращает числовое значение для опции уровня логов
 */
export function getLogFormat(logFormat?: LogFormats): LogFormats {
  if (logFormat) return logFormat;

  const envLogFormat = process.env.LOG_FORMAT?.toLowerCase();

  if (envLogFormat && LOG_FORMATS_KEYS.includes(envLogFormat)) {
    return envLogFormat as LogFormats;
  }

  return LogFormats.Json;
}
