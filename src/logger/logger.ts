import { isDefined, isEmpty } from '@zalib/core';

import { getRequestContext, getRequestId } from '../requests/context';
import { LoggerWriter } from './writer';

import {
  LogData,
  LogFormats,
  LoggerOptions,
  LogLevels,
  LogRecord,
} from './types';

import {
  LOG_FORMATS_KEYS,
  LOG_LEVEL_DEBUG,
  LOG_LEVEL_ERROR,
  LOG_LEVEL_FATAL,
  LOG_LEVEL_INFO,
  LOG_LEVEL_TRACE,
  LOG_LEVEL_WARN,
  LOG_LEVELS_KEYS,
  LOG_LEVELS_NUMS,
} from './constants';

export class Logger {
  readonly #source: string;
  readonly #logLevel: number;
  readonly #logFormat: LogFormats;
  readonly #loggerWriter: LoggerWriter;

  constructor(source: string, options?: LoggerOptions) {
    this.#loggerWriter = LoggerWriter.getInstance();

    this.#logLevel = this.#getOptionLogLevel(options?.logLevel);
    this.#logFormat = this.#getOptionLogFormat(options?.logFormat);
    this.#source = source.trim();
  }

  public trace(message: string, details?: unknown): void {
    if (this.#logLevel > LOG_LEVEL_TRACE) return;

    this.#write(LogLevels.Trace, { details, message });
  }

  public debug(message: string, details?: unknown): void {
    if (this.#logLevel > LOG_LEVEL_DEBUG) return;

    this.#write(LogLevels.Debug, { details, message });
  }

  public info(message: string, details?: unknown): void {
    if (this.#logLevel > LOG_LEVEL_INFO) return;

    this.#write(LogLevels.Info, { details, message });
  }

  public warn(message: string, details?: unknown): void {
    if (this.#logLevel > LOG_LEVEL_WARN) return;

    this.#write(LogLevels.Warn, { details, message });
  }

  public error(message: string, error: Error, details?: unknown): void {
    if (this.#logLevel > LOG_LEVEL_ERROR) return;

    this.#write(LogLevels.Error, {
      details,
      error,
      message,
    });
  }

  public fatal(message: string, error: Error, details?: unknown): void {
    if (this.#logLevel > LOG_LEVEL_FATAL) return;

    this.#write(LogLevels.Fatal, {
      details,
      error,
      message,
    });
  }

  /**
   * Дополняет, форматирует и отправляет на запись данные для лога
   */
  #write(level: LogLevels, data: LogData): void {
    const requestContext = getRequestContext();

    const requestTimeline = requestContext
      ? Date.now() - requestContext.startedAt
      : undefined;

    const logRecord = Object.assign(data, {
      level: LOG_LEVELS_NUMS[level],
      levelName: String(level),
      requestId: getRequestId(),
      source: this.#source,
      pid: process.pid,
      timeline: requestTimeline,
      timestamp: Date.now(),
    }) as unknown as LogRecord;

    const message = this.#format(logRecord);

    this.#loggerWriter.write(message);
  }

  /**
   * Форматирует данные для вывода
   */
  #format(data: LogRecord): string {
    if (this.#logFormat === LogFormats.Json) {
      return JSON.stringify(data);
    }

    const firstLine = [
      this.#formatDateTime(data.timestamp),
      data.levelName.toUpperCase(),
      `[${data.source}]`,
      data.message,
      isDefined(data.timeline) && `[${data.timeline}ms]`,
      isDefined(data.requestId) && `[req:${data.requestId}]`,
    ]
      .filter(Boolean)
      .join(' ');

    const result: string[] = [firstLine];

    if (data.error) {
      result.push(data.error.message);

      if (data.error.stack) {
        result.push(data.error.stack);
      }
    }

    if (!isEmpty(data.details)) {
      result.push(JSON.stringify(data.details));
    }

    return result.join('\n');
  }

  /**
   * Форматирует дату и время для вывода
   */
  #formatDateTime(timestamp: number): string {
    const date = new Date(timestamp);

    return [
      String(date.getDate()).padStart(2, '0'),
      '.',
      String(date.getMonth() + 1).padStart(2, '0'),
      '.',
      String(date.getFullYear()).slice(-2),
      ' ',
      String(date.getHours()).padStart(2, '0'),
      ':',
      String(date.getMinutes()).padStart(2, '0'),
      ':',
      String(date.getSeconds()).padStart(2, '0'),
    ].join('');
  }

  /**
   * Возвращает числовое значение для опции уровня логов
   */
  #getOptionLogLevel(logLevel?: LogLevels): number {
    if (logLevel) return LOG_LEVELS_NUMS[logLevel];

    const envLogLevel = process.env.LOG_LEVEL?.toLowerCase();

    if (envLogLevel && LOG_LEVELS_KEYS.includes(envLogLevel)) {
      return LOG_LEVELS_NUMS[envLogLevel as LogLevels];
    }

    return LOG_LEVELS_NUMS[LogLevels.Info];
  }

  /**
   * Возвращает числовое значение для опции уровня логов
   */
  #getOptionLogFormat(logFormat?: LogFormats): LogFormats {
    if (logFormat) return logFormat;

    const envLogFormat = process.env.LOG_FORMAT?.toLowerCase();

    if (envLogFormat && LOG_FORMATS_KEYS.includes(envLogFormat)) {
      return envLogFormat as LogFormats;
    }

    return LogFormats.Json;
  }
}

export function createLogger(source: string): Logger {
  return new Logger(source);
}
