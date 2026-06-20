import { isString } from '@zalib/core';

import { getRequestContext, getRequestId } from '../../requests/context';
import { getLogFormat, getLogLevel } from '../helpers';
import { LoggerWriter } from '../writer';

import { LogFormats, LoggerOptions, LogLevels, LogRecord } from '../types';

import {
  LOG_LEVEL_DEBUG,
  LOG_LEVEL_ERROR,
  LOG_LEVEL_FATAL,
  LOG_LEVEL_INFO,
  LOG_LEVEL_TRACE,
  LOG_LEVEL_WARN,
  LOG_LEVELS_NUMS,
} from '../constants';

type MessageObject = Record<string, unknown> & { message: string };

type WriteData = {
  context?: string;
  details?: unknown;
  error?: Error;
  message: string;
};

export class NestjsLogger {
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
  }

  public trace(message: unknown, context?: string): void {
    if (this.#logLevelNum > LOG_LEVEL_TRACE) return;

    const writeData = { ...this.#parseMessage(message), context };

    this.#writeData(LogLevels.Trace, writeData);
  }

  public debug(message: unknown, context?: string): void {
    if (this.#logLevelNum > LOG_LEVEL_DEBUG) return;

    const writeData = { ...this.#parseMessage(message), context };

    this.#writeData(LogLevels.Debug, writeData);
  }

  public log(message: unknown, context?: string): void {
    if (this.#logLevelNum > LOG_LEVEL_INFO) return;

    const writeData = { ...this.#parseMessage(message), context };

    this.#writeData(LogLevels.Info, writeData);
  }

  public warn(message: unknown, context?: string): void {
    if (this.#logLevelNum > LOG_LEVEL_WARN) return;

    const writeData = { ...this.#parseMessage(message), context };

    this.#writeData(LogLevels.Warn, writeData);
  }

  public error(message: string, error: Error, context?: string): void {
    if (this.#logLevelNum > LOG_LEVEL_ERROR) return;

    const writeData: WriteData = { ...this.#parseMessage(message), context };

    if (error) writeData.error = error;

    this.#writeData(LogLevels.Error, writeData);
  }

  public fatal(message: string, error: Error, context?: string): void {
    if (this.#logLevelNum > LOG_LEVEL_FATAL) return;

    const writeData: WriteData = { ...this.#parseMessage(message), context };

    if (error) writeData.error = error;

    this.#writeData(LogLevels.Fatal, writeData);
  }

  public flush(): Promise<void> {
    return this.#loggerWriter.flush();
  }

  #parseMessage(message: unknown): { details?: unknown; message: string } {
    if (isString(message)) return { message };

    const { message: msgFromObject, ...details } = message as MessageObject;

    if (msgFromObject) return { message: msgFromObject, details };

    return { message: 'Unknown message', details: message };
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
      context: data.context || this.#context,
      pid: process.pid,
      timeline: requestTimeline,
      timestamp: Date.now(),
    }) as unknown as LogRecord;

    this.#loggerWriter.write(logRecord, this.#logFormat);
  }
}
