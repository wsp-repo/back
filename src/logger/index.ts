import { Logger } from '@nestjs/common';

export function createLogger(source?: unknown): Logger {
  return console as unknown as Logger;
}
