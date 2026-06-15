import { CoreError } from '@zalib/core';

export class LoggerWriter {
  static #instance: LoggerWriter;

  #writingProcess: boolean = false;
  #writeBuffer: string[] = [];

  constructor() {
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

  public write(message: string): void {
    this.#writeBuffer.push(message + '\n');
    this.#writeStdout();
  }

  public flush(): Promise<void> {
    return Promise.resolve();
  }

  async #writeStdout(): Promise<void> {
    if (this.#writingProcess) return;

    if (this.#writeBuffer.length === 0) return;

    this.#writingProcess = true;

    const message = this.#writeBuffer.join('');

    this.#writeBuffer.length = 0;

    await new Promise((resolve) => {
      process.stdout.write(message, () => {
        resolve(true);
      });
    });

    // Если за время записи набралось
    if (this.#writeBuffer.length > 0) {
      setImmediate(() => this.#writeStdout());
    }

    this.#writingProcess = false;
  }
}
