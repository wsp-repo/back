import { LoggerService } from '@nestjs/common';
import {
  AnyObject,
  CoreError,
  getObjectFields,
  isDefined,
  isError,
  isObject,
  isString,
} from '@zalib/core';

import { getLogFormat, getLogLevel, getString } from '../helpers';
import { flushLogs, writeLog, WriteLogData } from '../writer';

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

export class NestjsLogger implements LoggerService {
  readonly #defContext: string;
  readonly #logLevel: LogLevels;
  readonly #logLevelNum: number;
  readonly #logFormat: LogFormats;

  #context: string;

  constructor(context: string, options?: LoggerOptions) {
    this.#logLevel = getLogLevel(options?.logLevel);
    this.#logLevelNum = LOG_LEVELS_NUMS[this.#logLevel];
    this.#logFormat = getLogFormat(options?.logFormat);
    this.#context = this.#defContext = context.trim();
  }

  public verbose(message: unknown, ...params: unknown[]): void {
    if (this.#logLevelNum > LOG_LEVEL_TRACE) return;

    const writeData = this.#getWriteData(LogLevels.Trace);

    this.#parseMessage(writeData, message);
    this.#parseParams(writeData, params);

    writeLog(writeData, this.#logFormat);
  }

  public debug(message: unknown, ...params: unknown[]): void {
    if (this.#logLevelNum > LOG_LEVEL_DEBUG) return;

    const writeData = this.#getWriteData(LogLevels.Debug);

    this.#parseMessage(writeData, message);
    this.#parseParams(writeData, params);

    writeLog(writeData, this.#logFormat);
  }

  public log(message: unknown, ...params: unknown[]): void {
    if (this.#logLevelNum > LOG_LEVEL_INFO) return;

    const writeData = this.#getWriteData(LogLevels.Info);

    this.#parseMessage(writeData, message);
    this.#parseParams(writeData, params);

    writeLog(writeData, this.#logFormat);
  }

  public warn(message: unknown, ...params: unknown[]): void {
    if (this.#logLevelNum > LOG_LEVEL_WARN) return;

    const writeData = this.#getWriteData(LogLevels.Warn);

    this.#parseMessage(writeData, message);
    this.#parseParams(writeData, params);

    writeLog(writeData, this.#logFormat);
  }

  public error(message: unknown, ...params: unknown[]): void {
    if (this.#logLevelNum > LOG_LEVEL_ERROR) return;

    const writeData = this.#getWriteData(LogLevels.Error);

    writeData.error = new CoreError();

    if (isError(message, false)) {
      writeData.error = message;
    } else if (isObject<AnyObject>(message)) {
      const {
        message: messageValue,
        msg: msgValue,
        stack,
        context,
        ...details
      } = message;

      if (isDefined(messageValue)) {
        writeData.error = new Error(String(messageValue));

        if (isDefined(msgValue)) {
          Object.assign(details, { msg: msgValue });
        }
      } else if (isDefined(msgValue)) {
        writeData.error = new Error(String(msgValue));
      }

      if (this.#isStack(stack)) {
        writeData.error.stack = stack;
      } else if (isDefined(stack)) {
        Object.assign(details, { stack });
      }

      if (isString(context)) {
        writeData.context = context;
      } else if (isDefined(context)) {
        Object.assign(details, { context });
      }

      writeData.details = details;
    } else if (isDefined(message)) {
      writeData.error = new Error(String(message));
    }

    if (params.length > 0) {
      let lastIndex = params.length - 1;

      if (isString(params[lastIndex]) && !this.#isStack(params[lastIndex])) {
        writeData.context = String(params[lastIndex]);

        lastIndex = lastIndex - 1;
      }

      if (lastIndex >= 0 && this.#isStack(params[lastIndex])) {
        writeData.error.stack = String(params[lastIndex]);

        lastIndex = lastIndex - 1;
      }

      if (lastIndex >= 0) {
        writeData.details = isDefined(writeData.details)
          ? [writeData.details, params.slice(0, lastIndex + 1)]
          : params.slice(0, lastIndex + 1);
      }
    }

    writeData.message = writeData.error.message;

    writeLog(writeData, this.#logFormat);
  }

  public fatal(message: unknown, ...params: unknown[]): void {
    if (this.#logLevelNum > LOG_LEVEL_FATAL) return;

    const writeData = this.#getWriteData(LogLevels.Fatal);

    this.#parseMessage(writeData, message);
    this.#parseParams(writeData, params);

    writeLog(writeData, this.#logFormat);
  }

  /**
   * Устанавливает текущий контекст логгера
   */
  public setContext(context: string): void {
    this.#context = context.trim();
  }

  /**
   * Восстанавливает контекст на исходный\
   */
  public resetContext(): void {
    this.#context = this.#defContext;
  }

  public flush(): Promise<void> {
    return flushLogs();
  }

  /**
   * Возвращает базовый объект данных для записи
   */
  #getWriteData(level: LogLevels): WriteLogData {
    const message = 'Unknown log message';

    return { context: this.#context, level, message };
  }

  /**
   * Разбирает message в объект writeData
   */
  #parseMessage(writeData: WriteLogData, message: unknown): void {
    if (isError(message)) {
      writeData.message = getString(message.message, writeData.message);
      writeData.error = message;
    } else if (isObject<AnyObject>(message)) {
      const { message: msg, context, error, stack, ...details } = message;

      if (isDefined(msg)) {
        writeData.message = getString(msg, writeData.message);
      }

      if (isString(context)) {
        writeData.context = getString(context, writeData.context);
      } else if (isDefined(context)) {
        details.context = context;
      }

      if (isError(error)) {
        writeData.error = error;
      } else if (isDefined(error)) {
        details.error = error;
      }

      if (isDefined(stack)) {
        const stringStack = String(stack).trim();

        if (stringStack.length && !writeData.error) {
          writeData.error = new CoreError(writeData.message);
          writeData.error.stack = stringStack;
        } else if (isDefined(stack)) {
          details.stack = stack;
        }
      }

      if (getObjectFields(details)?.length) {
        writeData.details = details;
      }
    } else if (isObject<AnyObject>(message)) {
      // пока недостижима, но оставляем
      writeData.details = message;
    } else if (isDefined(message)) {
      writeData.message = getString(message, writeData.message);
    }
  }

  /**
   * Разбирает параметры в объект writeData
   */
  #parseParams(writeData: WriteLogData, params?: unknown[]): void {
    if (!params?.length) return;

    if (isString(params[params.length - 1])) {
      writeData.context = getString(
        params[params.length - 1],
        writeData.context,
      );

      if (params.length > 2) {
        this.#addDetails(writeData, params.slice(0, -1));
      } else if (params.length > 1) {
        this.#addDetails(writeData, params[0]);
      }
    } else {
      if (params.length > 1) {
        this.#addDetails(writeData, params);
      } else if (params.length > 0) {
        this.#addDetails(writeData, params[0]);
      }
    }
  }

  /**
   * Добавляет детали в объект writeData
   */
  #addDetails(writeData: WriteLogData, details: unknown): void {
    if (isDefined(writeData.details) && isDefined(details)) {
      writeData.details = [writeData.details, details];
    } else if (isDefined(details)) {
      writeData.details = details;
    }
  }

  /**
   * Выполняет проверку подходимости под стек ошибки
   */
  #isStack(value: unknown): value is string {
    return isString(value) && /^(.)+\n\s+at .+:\d+:\d+/.test(value);
  }
}
