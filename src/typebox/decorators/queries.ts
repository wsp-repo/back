/* eslint-disable @typescript-eslint/naming-convention */

import { Query } from '@nestjs/common';
import { TSchema, TypeboxOptions } from '@zalib/core/typebox';

import { addConvert } from '../helpers';
import { createValidatorPipe } from '../pipes/validator';

/**
 * Алиас для декоратора @Query() с валидацией по схеме
 */
export function TypeboxQueries<Schema extends TSchema>(
  schema: Schema,
  options?: TypeboxOptions,
): ParameterDecorator {
  // параметры приходят как строки, необходима конвертация
  return Query(createValidatorPipe(schema, addConvert(options)));
}

/**
 * Алиас для декоратора @Query(property) с валидацией по схеме
 */
export function TypeboxQuery<Schema extends TSchema>(
  property: string,
  schema: Schema,
  options?: TypeboxOptions,
): ParameterDecorator {
  // параметры приходят как строки, необходима конвертация
  return Query(property, createValidatorPipe(schema, addConvert(options)));
}
