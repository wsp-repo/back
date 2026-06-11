import { readFileSync } from 'fs';
import { resolve } from 'path';

import { isObject } from '@zalib/core';
import { parse } from 'yaml';

import { fsStatSafe, getRootPath } from 'src/helpers';

import { ConfigYamlError } from '../errors';
import { ConfigObject, ConfigStorage } from '../storage';

import { ConfigLoader } from '../types';

const defaultFileName = 'config.default.yml';

export class ConfigYamlFiles implements ConfigLoader {
  private readonly storage = ConfigStorage.getInstance();

  private readonly rootPath = getRootPath();

  constructor() {
    this.getFiles().forEach((filePath) => {
      try {
        const configObject = parse(
          readFileSync(filePath, { encoding: 'utf-8' }),
          { schema: 'core', strict: true },
        ) as ConfigObject; // т.к. any

        if (!isObject<ConfigObject>(configObject)) {
          const message = 'Настройки не являются объектом';

          throw new ConfigYamlError(filePath, message);
        }

        this.storage.addConfig(configObject);
      } catch (error) {
        console.warn(error);

        throw error;
      }
    });
  }

  private getFiles(): string[] {
    const configYaml = process.env.CONFIG_YAML;
    const nodeEnv = (process.env.NODE_ENV || '').trim();
    const nodeEnvFileName = nodeEnv.length
      ? `config.${nodeEnv.toLowerCase()}.yml`
      : `config.yml`;

    const files = [
      this.checkFilePath(resolve(this.rootPath, defaultFileName), true),
      this.checkFilePath(resolve(this.rootPath, nodeEnvFileName), false),
      configYaml ? this.checkFilePath(configYaml, false) : undefined,
    ];

    // просто безопасный обход TS-ошибки
    return files.filter(Boolean) as string[];
  }

  private checkFilePath(
    filePath: string,
    required: boolean,
  ): string | undefined {
    if (fsStatSafe(filePath)?.isFile()) return filePath;

    if (required) {
      const message = 'Отсутствует обязательный файл';

      throw new ConfigYamlError(filePath, message);
    }

    return undefined;
  }
}
