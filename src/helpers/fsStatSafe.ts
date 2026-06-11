/* eslint-disable unusedImports/no-unused-vars */

import { Stats, statSync } from 'fs';

/**
 * Безопасный аналог fs.statSync
 */
export function fsStatSafe(path: string): Stats | null {
  try {
    return statSync(path);
  } catch (error) {}

  return null;
}
