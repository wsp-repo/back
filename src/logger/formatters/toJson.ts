import { toJsonObject } from '@zalib/core';

import { LogRecord } from '../types';

export function toJson(data: LogRecord): string {
  return JSON.stringify(toJsonObject(data));
}
