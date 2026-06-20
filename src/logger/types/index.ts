export enum LogLevels {
  Debug = 'debug',
  Error = 'error',
  Fatal = 'fatal',
  Info = 'info',
  Trace = 'trace',
  Warn = 'warn',
}

export enum LogFormats {
  Json = 'json',
  Plain = 'plain',
}

export type LogRecord = {
  context: string;
  details?: unknown;
  error?: Error;
  level: number;
  levelName: string;
  message: string;
  pid: number;
  requestId?: string;
  timeline?: number;
  timestamp: number;
};

export type LoggerOptions = {
  logFormat?: LogFormats;
  logLevel?: LogLevels;
};

export type LogAnyObject = Record<string, unknown>;

export type LogErrorObject =
  | (Error & { toJSON?: <T extends LogAnyObject>() => T })
  | {
      [key: string]: unknown;
      cause?: unknown;
      message: string;
      name?: string;
      stack?: string;
      toJSON?: <T extends LogAnyObject>() => T;
    };

export type LogDetailsObject = Omit<LogAnyObject, 'error'> & {
  error?: LogErrorObject;
};

export type LogDetailsPrimitive = string | number | boolean | bigint | null;

export type LogDetailsArray = unknown[];

export type LogDetails =
  | LogDetailsPrimitive
  | LogDetailsObject
  | LogDetailsArray;
