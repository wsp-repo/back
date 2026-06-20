import { isPrimitive, isUndefined } from '@zalib/core';

import { getRequestContext, getRequestId } from '../../requests/context';
import { getLogFormat, getLogLevel } from '../helpers';
import { LoggerWriter } from '../writer';

import {
  LogDetails,
  LogDetailsArray,
  LogDetailsObject,
  LogDetailsPrimitive,
  LogFormats,
  LoggerOptions,
  LogLevels,
  LogRecord,
} from '../types';

import {
  LOG_LEVEL_DEBUG,
  LOG_LEVEL_ERROR,
  LOG_LEVEL_FATAL,
  LOG_LEVEL_INFO,
  LOG_LEVEL_TRACE,
  LOG_LEVEL_WARN,
  LOG_LEVELS_NUMS,
} from '../constants';

type WriteData = {
  details?: unknown;
  error?: Error;
  message: string;
};

export class Logger {
  readonly #context: string;
  readonly #logLevel: LogLevels;
  readonly #logLevelNum: number;
  readonly #logFormat: LogFormats;
  readonly #loggerWriter: LoggerWriter;

  constructor(context: string, options?: LoggerOptions) {
    this.#loggerWriter = LoggerWriter.getInstance();

    this.#logLevel = getLogLevel(options?.logLevel);
    this.#logLevelNum = LOG_LEVELS_NUMS[this.#logLevel];
    this.#logFormat = getLogFormat(options?.logFormat);
    this.#context = context.trim();

    this.trace('', { www: 12345, error: new Error() });
    this.trace('', {
      www: 12345,
      error: { message: '', cause: true, ext: 1234 },
    });
    this.trace('', 'bcmhjb,lkblb');
  }

  public trace(message: string, details?: LogDetailsArray): void;
  public trace(message: string, details?: LogDetailsObject): void;
  public trace(message: string, details?: LogDetailsPrimitive): void;
  public trace(message: string, details?: LogDetails): void {
    if (this.#logLevelNum > LOG_LEVEL_TRACE) return;

    const writeData = this.#buildWriteData(message, details);

    return this.#writeData(LogLevels.Trace, writeData);
  }

  public debug(message: string, details?: LogDetails): void {
    if (this.#logLevelNum > LOG_LEVEL_DEBUG) return;

    const writeData = this.#buildWriteData(message, details);

    return this.#writeData(LogLevels.Debug, writeData);
  }

  public info(message: string, details?: unknown): void;
  public info(message: string, error: Error, details?: unknown): void;
  public info(message: string, errOrDets?: unknown, details?: unknown): void {
    if (this.#logLevelNum > LOG_LEVEL_INFO) return;

    const writeData = this.#buildWriteData(message, errOrDets, details);

    return this.#writeData(LogLevels.Info, writeData);
  }

  public warn(message: string, details?: unknown): void;
  public warn(message: string, error: Error, details?: unknown): void;
  public warn(message: string, errOrDets?: unknown, details?: unknown): void {
    if (this.#logLevelNum > LOG_LEVEL_WARN) return;

    const writeData = this.#buildWriteData(message, errOrDets, details);

    return this.#writeData(LogLevels.Warn, writeData);
  }

  public error(message: string, error: Error, details?: unknown): void {
    if (this.#logLevelNum > LOG_LEVEL_ERROR) return;

    const writeData = this.#buildWriteData(message, error, details);

    return this.#writeData(LogLevels.Error, writeData);
  }

  public fatal(message: string, error: Error, details?: unknown): void {
    if (this.#logLevelNum > LOG_LEVEL_FATAL) return;

    const writeData = this.#buildWriteData(message, error, details);

    return this.#writeData(LogLevels.Fatal, writeData);
  }

  public flush(): Promise<void> {
    return this.#loggerWriter.flush();
  }

  /**
   * Дополняет, форматирует и отправляет на запись данные для лога
   */
  #writeData(level: LogLevels, data: WriteData): void {
    const requestContext = getRequestContext();

    const requestTimeline = requestContext
      ? Date.now() - requestContext.startedAt
      : undefined;

    const logRecord = Object.assign(data, {
      level: LOG_LEVELS_NUMS[level],
      levelName: String(level),
      requestId: getRequestId(),
      context: this.#context,
      pid: process.pid,
      timeline: requestTimeline,
      timestamp: Date.now(),
    }) as unknown as LogRecord;

    this.#loggerWriter.write(logRecord, this.#logFormat);
  }

  /**
   * Формирует объект WriteData
   */
  #buildWriteData(message: string, details?: LogDetails): WriteData {
    if (isUndefined(details)) return { message };

    if (isPrimitive(details)) return { message, details };

    return errorOrDetails instanceof Error
      ? { message, error: errorOrDetails, details }
      : { message, details: errorOrDetails };
  }
}

export function createLogger(source: string): Logger {
  return new Logger(source);
}
