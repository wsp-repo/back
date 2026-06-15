import { FastifyInstance } from 'fastify';

import { createLogger, Logger } from '../logger';
import { createRequestContext } from '../requests/context';

export function initRequestContext(
  fastify: FastifyInstance,
  logger?: Logger,
): void {
  const localLogger = logger ?? createLogger('initRequestContext');

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

  fastify.addHook('onResponse', (_request, reply, done) => {
    localLogger.info('Outcome response', {
      statusCode: reply.statusCode,
    });

    done();
  });
}
