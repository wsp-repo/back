import { IEntryNestModule, NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { ApiExceptionFilter } from './apiExceptionFilter';
import { createAdapter } from './createAdapter';
import { initRequestContext } from './initRequestContext';

export async function createApplication(
  rootModule: IEntryNestModule,
  adapter?: FastifyAdapter,
): Promise<NestFastifyApplication> {
  const useAdapter = adapter || createAdapter();

  const app = await NestFactory.create<NestFastifyApplication>(
    rootModule,
    useAdapter,
    {
      bufferLogs: true,
      rawBody: true,
    },
  );

  app.useGlobalFilters(new ApiExceptionFilter());

  initRequestContext(app);

  return app;
}
