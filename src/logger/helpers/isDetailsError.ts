import { isDefined } from '@zalib/core';

import { LogDetailsWithError } from '../types';

export function isDetailsError(value: unknown): value is LogDetailsWithError {
  return isDefined((value as LogDetailsWithError).error);
}
