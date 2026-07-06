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
