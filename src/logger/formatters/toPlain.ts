/* eslint-disable @typescript-eslint/no-magic-numbers */

import { isDefined, isPrimitive } from '@zalib/core';

import { prepareError } from '../helpers/prepareError';

import { LogRecord } from '../types';

function formatDetails(details: unknown): string {
  return isPrimitive(details)
    ? `Details: ${String(details)}`
    : JSON.stringify(details);
}

function formatError(error: Error): string {
  const { message, stack, details } = prepareError(error);

  /* prettier-ignore */
  return [message, stack, formatDetails(details)]
    .filter(Boolean).join('\n');
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

export function toPlain(data: LogRecord): string {
  const firstLine = [
    formatDateTime(data.timestamp),
    data.levelName.toUpperCase(),
    `[${data.context}]`,
    data.message,
    isDefined(data.timeline) && `[${data.timeline}ms]`,
    isDefined(data.requestId) && `[req:${data.requestId}]`,
  ]
    .filter(Boolean)
    .join(' ');

  const result: string[] = [firstLine];

  if (isDefined(data.error)) {
    result.push(formatError(data.error));
  }

  if (isDefined(data.details)) {
    result.push(formatDetails(data.details));
  }

  return result.join('\n');
}
