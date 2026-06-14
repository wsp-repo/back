import { FastifyInstance } from 'fastify';

import { createRequestContext, getRequestContext } from '../requests/context';

export function initRequestContext(fastify: FastifyInstance): void {
  fastify.addHook('onRequest', async (request) => {
    const ctx = await createRequestContext();

    request.log.info({
      requestId: ctx.requestId,
      startedAt: ctx.startedAt,
    });
  });

  fastify.addHook('onSend', async (request, reply, payload) => {
    const ctx = getRequestContext();

    if (ctx) {
      request.log.info({
        requestId: ctx.requestId,
        statusCode: reply.statusCode,
        durationMs: Date.now() - ctx.startedAt,
      });
    }

    return payload;
  });
}
