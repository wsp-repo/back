import { dirname, resolve } from 'path';

import { CoreError } from '@zalib/core/errors';
import { isDefined } from '@zalib/core/helpers';

import { fsStatSafe } from './fsStatSafe';

// Кеш для значения
const pathMap = new Map<string, string | undefined>();

function throwPathError(checkFile: string): never {
  const message = `Корневая директория не определена`;

  throw new CoreError(message, { checkFile });
}

/**
 * Возвращает путь до корня (по умолчанию - package.json)
 */
export function getRootPath(checkFile = 'package.json'): string {
  const cachedPath = pathMap.get(checkFile);

  if (isDefined(cachedPath)) return cachedPath;

  let checkPath = process.cwd();

  while (true) {
    const filePath = resolve(checkPath, checkFile);

    if (fsStatSafe(filePath)?.isFile()) {
      pathMap.set(checkFile, checkPath);

      return checkPath;
    }

    const parentPath = dirname(checkPath);

    // проверка, что уже дошло до корня FS
    if (checkPath === parentPath) {
      throwPathError(checkFile);
    }

    checkPath = parentPath;
  }
}
