/* eslint-disable @typescript-eslint/naming-convention */

import { Body } from '@nestjs/common';
import { TSchema, TypeboxOptions } from '@zalib/core/typebox';

import { createValidatorPipe } from '../pipes/validator';

/**
 * Алиас для декоратора @Body() с валидацией по схеме
 */
export function TypeboxBody<Schema extends TSchema>(
  schema: Schema,
  options?: TypeboxOptions,
): ParameterDecorator {
  return Body(createValidatorPipe(schema, options));
}
