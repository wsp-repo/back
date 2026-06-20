import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { CoreError, isObject } from '@zalib/core';

import { createLogger, Logger } from '../logger';
import { createRequestContext } from '../requests/context';

export function initRequestContext(
  app: NestFastifyApplication,
  logger?: Logger,
): void {
  const localLogger = logger ?? createLogger('initRequestContext');

  const fastify = app.getHttpAdapter().getInstance();

  fastify.addHook('onRequest', (request, _reply, done) => {
    createRequestContext();

    localLogger.info('Income request', {
      method: request.method,
      ip: request.ip,
      url: request.url,
      userAgent: request.headers['user-agent'],
      query: request.query,
    });

    done();
  });

  fastify.addHook('preSerialization', (_request, _reply, payload, done) => {
    if (isObject<{ error: CoreError }>(payload) && payload.error) {
      localLogger.warn('Outcome error', {
        code: payload.error.code,
        message: payload.error.message,
      });
    }

    done(null, payload);
  });

  fastify.addHook('onResponse', (_request, reply, done) => {
    localLogger.info('Outcome response', {
      statusCode: reply.statusCode,
    });

    done();
  });
}
