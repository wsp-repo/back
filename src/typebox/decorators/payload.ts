/* eslint-disable @typescript-eslint/naming-convention */

import { Payload } from '@nestjs/microservices';
import { TSchema, TypeboxOptions } from '@zalib/core/typebox';

import { createValidatorPipe } from '../pipes/validator';

/**
 * Алиас для декоратора @Payload() с валидацией по схеме
 */
export function TypeboxPayload<Schema extends TSchema>(
  schema: Schema,
  options?: TypeboxOptions,
): ParameterDecorator {
  return Payload(createValidatorPipe(schema, options));
}
