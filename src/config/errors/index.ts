import { CoreError } from '@zalib/core';

type BaseError = Pick<CoreError, 'message' | 'details'>;

function getBaseError(error: unknown, details?: unknown): BaseError {
  // хак через каст вместо if-проверок
  const coreError = error as CoreError;
  const message = coreError.message || String(error);

  return { details: details || coreError.details, message };
}

export class ConfigValueError extends CoreError {
  public readonly code = 'CONFIG_VALUE_ERROR';

  constructor(jsonPath: string, error: unknown, details?: unknown) {
    const baseError = getBaseError(error, details);

    super(
      `Ошибка конфигурации '${jsonPath}'. ${baseError.message}`,
      baseError.details,
    );
  }
}

export class ConfigYamlError extends CoreError {
  public readonly code = 'CONFIG_YAML_ERROR';

  constructor(filePath: string, error: unknown, details?: unknown) {
    const baseError = getBaseError(error, details);

    super(
      `Ошибка YAML-файла '${filePath}'. ${baseError.message}`,
      baseError.details,
    );
  }
}

export class ConfigEnvError extends CoreError {
  public readonly code = 'CONFIG_ENV_ERROR';

  constructor(envName: string, error: unknown, details?: unknown) {
    const baseError = getBaseError(error, details);

    super(
      `Ошибка ENV-переменной '${envName}'. ${baseError.message}`,
      baseError.details,
    );
  }
}
