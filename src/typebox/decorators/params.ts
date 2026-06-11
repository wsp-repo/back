/* eslint-disable @typescript-eslint/naming-convention */

import { Param } from '@nestjs/common';
import { TSchema, TypeboxOptions } from '@zalib/core/typebox';

import { addConvert } from '../helpers';
import { createValidatorPipe } from '../pipes/validator';

/**
 * Алиас для декоратора @Param() с валидацией по схеме
 */
export function TypeboxParams<Schema extends TSchema>(
  schema: Schema,
  options?: TypeboxOptions,
): ParameterDecorator {
  // параметры приходят как строки, необходима конвертация
  return Param(createValidatorPipe(schema, addConvert(options)));
}

/**
 * Алиас для декоратора @Param(property) с валидацией по схеме
 */
export function TypeboxParam<Schema extends TSchema>(
  property: string,
  schema: Schema,
  options?: TypeboxOptions,
): ParameterDecorator {
  // параметры приходят как строки, необходима конвертация
  return Param(property, createValidatorPipe(schema, addConvert(options)));
}
