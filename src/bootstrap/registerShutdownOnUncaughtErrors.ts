import { NestFastifyApplication } from '@nestjs/platform-fastify';

import { createLogger, Logger } from '../logger';

export function registerShutdownOnUncaughtErrors(
  app: NestFastifyApplication,
  logger?: Logger,
): void {
  const localLogger =
    logger ?? createLogger('registerShutdownOnUncaughtErrors');

  process.once('unhandledRejection', async (reason: unknown) => {
    const error = new Error('Process unhandledRejection');

    localLogger.error('Unhandled Rejection:', error, reason);

    /* prettier-ignore */
    await localLogger.flush().catch((err) => {
      console.error('unhandledRejection logger.flush', err);
    });

    app.close().then(() => process.exit(1));
  });

  process.once('uncaughtException', async (error: Error) => {
    localLogger.error('Uncaught Exception:', error);

    /* prettier-ignore */
    await localLogger.flush().catch((err) => {
      console.error('uncaughtException logger.flush', err);
    });

    app.close().then(() => process.exit(1));
  });
}
