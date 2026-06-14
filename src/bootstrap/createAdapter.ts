import { FastifyAdapter } from '@nestjs/platform-fastify';
import { FastifyServerOptions } from 'fastify';
import { IParseOptions, parse } from 'qs';

/**
 * Набор опций для парсера QueryString по умолчанию
 */
export const QS_PARSER_OPTIONS: IParseOptions = {
  allowPrototypes: false,
  plainObjects: true,
  allowEmptyArrays: false,
  arrayLimit: 100000,
  duplicates: 'combine',
  parameterLimit: 100,
  throwOnLimitExceeded: true,
} as const;

/**
 * Парсер QueryString по умолчанию (на базе qs с дефолтными опциями)
 */
function defaultQueryStringParser(query: string): Record<string, unknown> {
  return parse(query, QS_PARSER_OPTIONS);
}

/**
 * Фабричная функция для создавния дааптера Fastify
 */
export function createAdapter(options?: FastifyServerOptions): FastifyAdapter {
  const routerOptions = {
    querystringParser: defaultQueryStringParser,
    ...options?.routerOptions,
  };

  return new FastifyAdapter({ ...options, routerOptions });
}
