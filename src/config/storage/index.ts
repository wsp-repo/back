/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Global, Injectable } from '@nestjs/common';
import {
  deepMerge,
  MergeArray,
  DeepPartial,
  isDefined,
  isUndefined,
} from '@zalib/core';

const regexpSplitPath = /(?:\.\[)|(?:\]\.)|(?:[\.\[\]])/g;

export type ConfigObject = DeepPartial<Record<string, unknown>>;

@Global()
@Injectable()
export class ConfigStorage {
  private static instance: ConfigStorage;

  private readonly storage: ConfigObject = {};

  constructor() {
    if (isDefined(ConfigStorage.instance)) {
      throw new Error('ConfigStorage is initialized!');
    }

    ConfigStorage.instance = this;
  }

  public static getInstance(): ConfigStorage {
    if (!ConfigStorage.instance) {
      throw new Error('ConfigStorage not initialized!');
    }

    return ConfigStorage.instance;
  }

  /**
   * Добавить в конфиг секцию
   */
  public addConfig(config: ConfigObject): void {
    deepMerge(this.storage, config, {
      mergeArray: MergeArray.Replace,
      mutate: true,
    });
  }

  /**
   * Чтение значения конфига по пути
   */
  public getValue(path: string): unknown {
    const parts = this.splitPath(path);

    let iterationValue: any = this.storage;

    for (let i = 0; i < parts.length; i++) {
      iterationValue = iterationValue?.[parts[i]];

      if (this.isUndefinedValue(iterationValue)) {
        return undefined;
      }
    }

    if (this.isUndefinedValue(iterationValue)) {
      return undefined;
    }

    return iterationValue;
  }

  /**
   * Проверяет, что значение - эквивалент undefined
   */
  private isUndefinedValue(value?: unknown): boolean {
    return isUndefined(value) || value === null;
  }

  /**
   * Возвращает массив пути
   */
  private splitPath(path: string): string[] {
    if (Array.isArray(path)) return path;

    const arr = path.split(regexpSplitPath);

    while (arr.length && !arr[arr.length - 1]) {
      arr.length -= 1;
    }

    return arr;
  }
}
