import { getRequestContext, getRequestId } from '../../request/context';
import { FORMATTERS } from '../formatters';

import { LogFormats, LogLevels } from '../types';

import { LOG_LEVELS_NUMS } from '../constants';

export type WriteLogData = {
  context: string;
  details?: unknown;
  error?: Error;
  level: LogLevels;
  message: string;
};

const messagesBuffer: string[] = [];
let flushBuffer: (() => void)[] = [];

let writingPromise: Promise<void> | undefined;
let writingProcess: boolean = false;

export function writeLog(
  data: WriteLogData,
  format: LogFormats = LogFormats.Json,
): void {
  const formatter = FORMATTERS[format] ?? FORMATTERS[LogFormats.Json];

  const requestContext = getRequestContext();
  const requestTimeline = requestContext
    ? Date.now() - requestContext.startedAt
    : undefined;

  const logMessage = formatter({
    context: data.context,
    details: data.details,
    error: data.error,
    level: LOG_LEVELS_NUMS[data.level],
    levelName: String(data.level),
    message: data.message,
    requestId: getRequestId(),
    pid: process.pid,
    timeline: requestTimeline,
    timestamp: Date.now(),
  });

  messagesBuffer.push(logMessage);
  writeStdout();
}

/**
 * Гарантирует запись сообщений, отправленных до вызова метода
 */
export function flushLogs(): Promise<void> {
  if (messagesBuffer.length > 0) {
    return new Promise<void>((resolve) => {
      flushBuffer.push(resolve);
    });
  }

  if (writingPromise) return writingPromise;

  return Promise.resolve();
}

async function writeStdout(): Promise<void> {
  if (writingProcess) return;

  if (messagesBuffer.length === 0) return;

  writingProcess = true;

  const writeFlushBuffer = flushBuffer;
  const writeMessage = messagesBuffer.join('\n');

  messagesBuffer.length = 0; // можно мягко очистить
  flushBuffer = []; // обязательно полное пересоздание

  writingPromise = new Promise<void>((resolve) => {
    process.stdout.write(writeMessage + '\n', () => resolve());
  });

  await writingPromise;

  // Если за время записи набралось
  if (messagesBuffer.length > 0) {
    setImmediate(() => {
      writingProcess = false;
      writeStdout();
    });
  } else {
    writingProcess = false;
  }

  writingPromise = undefined;

  writeFlushBuffer.forEach((resolve) => {
    resolve();
  });
}
