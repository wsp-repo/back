import { CoreError } from '@zalib/core';

import { FORMATTERS } from '../formatters';

import { LogFormats, LogRecord } from '../types';

export class LoggerWriter {
  static #instance: LoggerWriter;

  #messagesBuffer: string[] = [];
  #flushBuffer: (() => void)[] = [];

  #writingPromise: Promise<void> | undefined;
  #writingProcess: boolean = false;

  private constructor() {
    if (LoggerWriter.#instance) {
      throw new CoreError('Singleton');
    }

    LoggerWriter.#instance = this;
  }

  public static getInstance(): LoggerWriter {
    if (!LoggerWriter.#instance) {
      new LoggerWriter();
    }

    return LoggerWriter.#instance;
  }

  public write(data: LogRecord, format: LogFormats = LogFormats.Json): void {
    const formatter = FORMATTERS[format] ?? FORMATTERS[LogFormats.Json];

    this.#messagesBuffer.push(formatter(data));
    this.#writeStdout();
  }

  /**
   * Гарантирует запись сообщений, отправленных до вызова метода
   */
  public flush(): Promise<void> {
    if (this.#messagesBuffer.length > 0) {
      return new Promise<void>((resolve) => {
        this.#flushBuffer.push(resolve);
      });
    }

    if (this.#writingPromise) {
      return this.#writingPromise;
    }

    return Promise.resolve();
  }

  async #writeStdout(): Promise<void> {
    if (this.#writingProcess) return;

    if (this.#messagesBuffer.length === 0) return;

    this.#writingProcess = true;

    const flushBuffer = this.#flushBuffer;
    const writeMessage = this.#messagesBuffer.join('\n');

    this.#messagesBuffer.length = 0; // можно мягко очистить
    this.#flushBuffer = []; // обязательно пересоздание

    this.#writingPromise = new Promise<void>((resolve) => {
      process.stdout.write(writeMessage + '\n', () => resolve());
    });

    await this.#writingPromise;

    // Если за время записи набралось
    if (this.#messagesBuffer.length > 0) {
      setImmediate(() => {
        this.#writingProcess = false;
        this.#writeStdout();
      });
    } else {
      this.#writingProcess = false;
    }

    this.#writingPromise = undefined;

    flushBuffer.forEach((resolve) => {
      resolve();
    });
  }
}
