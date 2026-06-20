/* eslint-disable unusedImports/no-unused-vars */

import { isError, toJsonObject } from '@zalib/core';

import { LogAnyObject, LogErrorObject } from '../types';

/**
 * Формирует из ошибки лог-объект
 */
export function errorToObject(
  logErrorObject: LogErrorObject,
  noStack?: boolean,
): LogAnyObject {
  const { stack, ...errorObject } = toJsonObject<Error>(logErrorObject);

  return {
    ...errorObject,
    message: logErrorObject.message,
    name: logErrorObject.name,
    stack: noStack ? undefined : logErrorObject.stack,
    cause: isError(logErrorObject.cause)
      ? errorToObject(logErrorObject.cause)
      : undefined,
  };
}
