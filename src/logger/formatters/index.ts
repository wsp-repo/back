import { toJson } from './toJson';
import { toPlain } from './toPlain';

import { LogFormats } from '../types';

export const FORMATTERS = {
  [LogFormats.Json]: toJson,
  [LogFormats.Plain]: toPlain,
};
