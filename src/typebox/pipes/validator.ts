import { PipeTransform } from '@nestjs/common';
import {
  TSchema,
  StaticDecode,
  TypeboxOptions,
  TypeboxValidator,
  createValidator,
} from '@zalib/core/typebox';

/**
 * Валидация данных по схеме typebox
 */
export class TypeboxValidatorPipe<
  Schema extends TSchema,
> implements PipeTransform {
  private readonly validator: TypeboxValidator<Schema>;

  constructor(schema: Schema, options?: TypeboxOptions) {
    this.validator = createValidator(schema, options);
  }

  public transform(value: unknown): StaticDecode<Schema> {
    return this.validator.compile(value);
  }
}

/**
 * Фабричный метод для создания пайпа
 */
export function createValidatorPipe<Schema extends TSchema>(
  schema: Schema,
  options?: TypeboxOptions,
): TypeboxValidatorPipe<Schema> {
  return new TypeboxValidatorPipe<Schema>(schema, options);
}
