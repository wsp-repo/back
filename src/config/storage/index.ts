/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  mergeJsonObjects,
  isUndefined,
  JsonObject,
  MergeArrayModes,
  isDefined,
} from '@zalib/core';

const regexpSplitPath = /(?:\.\[)|(?:\]\.)|(?:[\.\[\]])/g;

export type ConfigObject = JsonObject;

type StorageState = {
  config: ConfigObject;
  isReady?: true;
};

let state: StorageState | undefined;

export function cleanConfig(): void {
  state = undefined;
}

/**
 * Добавить в конфиг секцию
 */
export function addConfig(config: ConfigObject): void {
  if (state?.isReady) throw new Error('Config is ready');

  if (isUndefined(state)) state = { config: {} };

  mergeJsonObjects(state.config, config, {
    mergeArray: MergeArrayModes.Replace,
    mutate: true,
  });
}

export function setReadyConfig(): void {
  if (isDefined(state)) {
    state.isReady = true;

    return;
  }

  throw new Error('ConfigStorage empty config');
}

/**
 * Чтение значения конфига по пути
 */
export function getValue(path: string): unknown {
  if (isUndefined(state?.isReady)) {
    throw new Error('ConfigStorage not initialized!');
  }

  const parts = splitPath(path);

  let iterationValue: any = state.config;

  for (let i = 0; i < parts.length; i++) {
    iterationValue = iterationValue?.[parts[i]];

    if (isUndefinedValue(iterationValue)) {
      return undefined;
    }
  }

  if (isUndefinedValue(iterationValue)) {
    return undefined;
  }

  return iterationValue;
}

/**
 * Проверяет, что значение - эквивалент undefined
 */
function isUndefinedValue(value?: unknown): boolean {
  return isUndefined(value) || value === null;
}

/**
 * Возвращает массив пути
 */
function splitPath(path: string): string[] {
  const arr = path.split(regexpSplitPath);

  while (arr.length && !arr[arr.length - 1]) {
    arr.length -= 1;
  }

  return arr;
}
