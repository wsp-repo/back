/* eslint-disable @typescript-eslint/naming-convention */

import { MessageBody } from '@nestjs/websockets';
import { TSchema, TypeboxOptions } from '@zalib/core/typebox';

import { createValidatorPipe } from '../pipes/validator';

/**
 * Алиас для декоратора @MessageBody() с валидацией по схеме
 */
export function TypeboxWsBody<Schema extends TSchema>(
  schema: Schema,
  options?: TypeboxOptions,
): ParameterDecorator {
  return MessageBody(createValidatorPipe(schema, options));
}
