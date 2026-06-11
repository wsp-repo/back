import { readFileSync } from 'fs';

import { isUndefined } from '@zalib/core/helpers';

import { getRootPath } from './getRootPath';

type Engines = {
  node?: string;
  npm?: string;
};

type NpmData = {
  engines?: Engines;
  name?: string;
  version?: string;
};

export type AppData = {
  engines?: Engines;
  name?: string;
  node?: string;
  path?: string;
  pid: number;
  uid?: number;
  version?: string;
};

/**
 * Читает данные файла package.json
 */
function readPackage(): NpmData {
  const packagePath = `${getRootPath()}/package.json`;
  const packageString = readFileSync(packagePath).toString();

  return JSON.parse(packageString) as NpmData;
}

/**
 * Создает класс-геттер с данными версий
 */
function createEnginesClass(npmData: NpmData): Engines {
  return new (class {
    public get node(): string | undefined {
      return npmData.engines?.node || process.env.npm_package_engines_node;
    }

    public get npm(): string | undefined {
      return npmData.engines?.npm || process.env.npm_package_engines_npm;
    }
  })();
}

/**
 * Создает класс-геттер с данными приложения
 */
function createAppDataClass(engines: Engines, npmData: NpmData): AppData {
  return new (class {
    public get engines(): Engines {
      return engines;
    }

    public get name(): string | undefined {
      return npmData.name || process.env.npm_package_name;
    }

    public get node(): string | undefined {
      return process.version;
    }

    public get path(): string | undefined {
      return getRootPath();
    }

    public get pid(): number {
      return process.pid;
    }

    public get uid(): number | undefined {
      return process.getuid && process.getuid();
    }

    public get version(): string | undefined {
      return npmData.version || process.env.npm_package_version;
    }
  })();
}

let appData: AppData;

/**
 * Возвращает данные по приложению
 */
export function getAppData(): AppData {
  if (isUndefined(appData)) {
    const npmData = readPackage();

    /* prettier-ignore */
    appData = createAppDataClass(
      createEnginesClass(npmData),
      npmData,
    );
  }

  return appData;
}
