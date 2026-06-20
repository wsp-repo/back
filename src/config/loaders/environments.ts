/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  camelCase,
  isArray,
  isNumber,
  isNumeric,
  isObject,
  isUpperCase,
} from '@zalib/core';

import { ConfigEnvError } from '../errors';
import { ConfigObject, addConfig } from '../storage';

import { ConfigLoader } from '../types';

type ConfigPath = (string | number)[];

const cfgPrefixString = 'APP__';
const cfgPrefixLength = cfgPrefixString.length;

export class ConfigEnvironments implements ConfigLoader {
  readonly #configObject: any = {};

  public loadConfig(): void {
    for (const configEnv of this.#getConfigEnvs()) {
      this.#setConfigValue(
        this.#getConfigPath(configEnv),
        process.env[configEnv],
      );
    }

    addConfig(this.#configObject as ConfigObject);
  }

  /**
   * Задает значение в локальном конфиге по его адресу
   */
  #setConfigValue(path: ConfigPath, value: string = ''): void {
    let cursor = this.#configObject;

    for (let i = 0; i < path.length; i++) {
      const currKey = path[i];

      // последняя часть пути
      if (i === path.length - 1) {
        cursor[currKey] = this.#parseValue(value);

        return;
      }

      const nextKey = path[i + 1];

      if (isNumber(nextKey)) {
        if (!isArray(cursor[currKey])) {
          cursor[currKey] = [];
        }
      } else if (!isObject(cursor[currKey])) {
        cursor[currKey] = {};
      }

      cursor = cursor[currKey];
    }
  }

  /**
   * Пытается парсить значение в типизированный формат
   */
  #parseValue(value: string): unknown {
    if (value === '') return null;

    try {
      return JSON.parse(value);
      // eslint-disable-next-line
    } catch (parseError) {}

    return value;
  }

  /**
   * Возвращает подготовленный массив пути для переменной
   */
  #getConfigPath(envName: string): ConfigPath {
    const cfgEnvKey = envName.slice(cfgPrefixLength);

    if (cfgEnvKey.length === 0) {
      throw new ConfigEnvError(envName, `Ошибка формата`);
    }

    const cfgEnvParts = cfgEnvKey.split('__');

    const configParts = cfgEnvParts.reduce((parts, part, index) => {
      if (index > 0 && isNumeric(part)) {
        parts.push(Number(part));
      } else if (isUpperCase(part)) {
        parts.push(camelCase(part));
      }

      return parts;
    }, [] as ConfigPath);

    if (configParts.length < cfgEnvParts.length) {
      throw new ConfigEnvError(envName, `Ошибка формата`);
    }

    return configParts;
  }

  /**
   * Возвращает отсортированный список переменных конфигурации
   */
  #getConfigEnvs(): string[] {
    return Object.keys(process.env)
      .filter((envName) => envName.startsWith(cfgPrefixString))
      .sort();
  }
}
