import { Logger } from '@nestjs/common';
import { NestFastifyApplication } from '@nestjs/platform-fastify';

export function exitOnUnhandledError(
  app: NestFastifyApplication,
  logger?: Logger,
): void {
  process.on('unhandledRejection', (reason: unknown) => {
    const error = new Error('Process unhandledRejection');

    (logger || console).error('Unhandled Rejection:', error, reason);

    app.close().then(() => process.exit(1));
  });
  process.on('uncaughtException', (error: Error) => {
    (logger || console).error('Uncaught Exception:', error);

    app.close().then(() => process.exit(1));
  });
}
