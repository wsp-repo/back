/* eslint-disable @typescript-eslint/naming-convention */

import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { camelCase } from '@zalib/core/helpers';
import { TSchema, TypeboxOptions } from '@zalib/core/typebox';

import { addConvert } from '../helpers';
import { createValidatorPipe } from '../pipes/validator';

type Headers = Record<string, string>;

function getHeaders(ctx: ExecutionContext): Record<string, unknown> {
  const { headers } = ctx.switchToHttp().getRequest<{ headers: Headers }>();

  const keys = Object.keys(headers);
  const result = Object.create(null) as Headers;

  for (let i = 0; i < keys.length; i++) {
    const value = headers[keys[i]];

    result[keys[i].toLowerCase()] = value;
    result[camelCase(keys[i])] = value;
    result[keys[i]] = value;
  }

  return result;
}

// Фабричная функция для создания декоратора с несколькими параметрами
export function TypeboxHeader<Schema extends TSchema>(
  header: string,
  schema: Schema,
  options?: TypeboxOptions,
): ParameterDecorator {
  return createParamDecorator((_: undefined, ctx: ExecutionContext) => {
    return createValidatorPipe(schema, addConvert(options)).transform(
      getHeaders(ctx)[header],
    );
  })();
}

// Фабричная функция для создания декоратора с несколькими параметрами
export function TypeboxHeaders<Schema extends TSchema>(
  schema: Schema,
  options?: TypeboxOptions,
): ParameterDecorator {
  return createParamDecorator((_: undefined, ctx: ExecutionContext) => {
    return createValidatorPipe(schema, addConvert(options)).transform(
      getHeaders(ctx),
    );
  })();
}
