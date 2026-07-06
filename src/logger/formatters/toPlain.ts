/* eslint-disable @typescript-eslint/no-magic-numbers */

import {
  isCoreError,
  isDefined,
  isPrimitive,
  isUndefined,
  toJsonObject,
} from '@zalib/core';

import { LogRecord } from '../types';

export function toPlain(data: LogRecord): string {
  const title = [
    formatDateTime(data.timestamp),
    data.levelName.toUpperCase(),
    `[${data.context}]`,
    data.message,
    isDefined(data.timeline) && `[${data.timeline}ms]`,
    isDefined(data.requestId) && `[req:${data.requestId}]`,
  ]
    .filter(Boolean)
    .join(' ');
  const details = formatDetails(data.details);
  const error = formatError(data.error);

  /* prettier-ignore */
  return [title, error, details]
    .filter(Boolean)
    .join('\n');
}

/**
 * Форматирует вывод ошибки
 */
function formatError(error?: Error): string | undefined {
  if (isUndefined(error)) return undefined;

  const errorDetails = isCoreError(error)
    ? formatDetails(error.details)
    : undefined;

  /* prettier-ignore */
  return [error.message, error.stack, errorDetails]
    .filter(Boolean).join('\n');
}

/**
 * Форматирует вывод деталей
 */
function formatDetails(details?: unknown): string | undefined {
  if (isUndefined(details)) return undefined;

  if (isPrimitive(details)) {
    return `Details: ${String(details)}`;
  }

  const jsonDetails = toJsonObject(details);

  return JSON.stringify(jsonDetails);
}

/**
 * Форматирует дату и время для вывода
 */
function formatDateTime(timestamp: number): string {
  const date = new Date(timestamp);

  return [
    String(date.getDate()).padStart(2, '0'),
    '.',
    String(date.getMonth() + 1).padStart(2, '0'),
    '.',
    String(date.getFullYear()).slice(-2),
    ' ',
    String(date.getHours()).padStart(2, '0'),
    ':',
    String(date.getMinutes()).padStart(2, '0'),
    ':',
    String(date.getSeconds()).padStart(2, '0'),
  ].join('');
}
