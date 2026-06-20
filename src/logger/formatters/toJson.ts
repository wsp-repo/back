import { isDefined } from '@zalib/core';

import { prepareError } from '../helpers/prepareError';

import { LogRecord } from '../types';

export function toJson(data: LogRecord): string {
  /* prettier-ignore */
  const error = isDefined(data.error)
    ? prepareError(data.error)
    : undefined;

  return JSON.stringify({ ...data, error });
}
