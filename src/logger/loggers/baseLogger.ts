import { isError } from '@zalib/core';

import { getLogFormat, getLogLevel } from '../helpers';
import { writeLog, flushLogs, WriteLogData } from '../writer';

import { LogFormats, LoggerOptions, LogLevels } from '../types';

import {
  LOG_LEVEL_DEBUG,
  LOG_LEVEL_ERROR,
  LOG_LEVEL_FATAL,
  LOG_LEVEL_INFO,
  LOG_LEVEL_TRACE,
  LOG_LEVEL_WARN,
  LOG_LEVELS_NUMS,
} from '../constants';

export class Logger {
  readonly #context: string;
  readonly #logLevelNum: number;
  readonly #logFormat: LogFormats;

  constructor(context: string, options?: LoggerOptions) {
    this.#logLevelNum = LOG_LEVELS_NUMS[getLogLevel(options?.logLevel)];
    this.#logFormat = getLogFormat(options?.logFormat);
    this.#context = context.trim();
  }

  public trace(message: string, details?: unknown): void;
  public trace(message: string, error: Error, details?: unknown): void;
  public trace(message: string, errOrDets?: unknown, details?: unknown): void {
    if (this.#logLevelNum > LOG_LEVEL_TRACE) return;

    this.#writeLog(LogLevels.Trace, message, errOrDets, details);
  }

  public debug(message: string, details?: unknown): void;
  public debug(message: string, error: Error, details?: unknown): void;
  public debug(message: string, errOrDets?: unknown, details?: unknown): void {
    if (this.#logLevelNum > LOG_LEVEL_DEBUG) return;

    this.#writeLog(LogLevels.Debug, message, errOrDets, details);
  }

  public info(message: string, details?: unknown): void;
  public info(message: string, error: Error, details?: unknown): void;
  public info(message: string, errOrDets?: unknown, details?: unknown): void {
    if (this.#logLevelNum > LOG_LEVEL_INFO) return;

    this.#writeLog(LogLevels.Info, message, errOrDets, details);
  }

  public warn(message: string, details?: unknown): void;
  public warn(message: string, error: Error, details?: unknown): void;
  public warn(message: string, errOrDets?: unknown, details?: unknown): void {
    if (this.#logLevelNum > LOG_LEVEL_WARN) return;

    this.#writeLog(LogLevels.Warn, message, errOrDets, details);
  }

  public error(message: string, error: Error, details?: unknown): void {
    if (this.#logLevelNum > LOG_LEVEL_ERROR) return;

    this.#writeLog(LogLevels.Error, message, error, details);
  }

  public fatal(message: string, error: Error, details?: unknown): void {
    if (this.#logLevelNum > LOG_LEVEL_FATAL) return;

    this.#writeLog(LogLevels.Fatal, message, error, details);
  }

  public flush(): Promise<void> {
    return flushLogs();
  }

  /**
   * Собирает и отправляет на запись данные для лога
   */
  #writeLog(
    level: LogLevels,
    message: string,
    errOrDets?: unknown,
    details?: unknown,
  ): void {
    const dataError = isError(errOrDets);

    const logData: WriteLogData = {
      context: this.#context,
      details: dataError ? details : errOrDets,
      error: dataError ? errOrDets : undefined,
      level,
      message,
    };

    writeLog(logData, this.#logFormat);
  }
}

export function createLogger(context: string, options?: LoggerOptions): Logger {
  return new Logger(context, options);
}
