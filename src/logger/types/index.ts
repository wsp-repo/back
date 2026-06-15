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

export type LogData = {
  details?: unknown;
  error?: Error;
  message: string;
};

export type LogRecord = LogData & {
  level: number;
  levelName: string;
  pid: number;
  requestId?: string;
  source: string;
  timeline?: number;
  timestamp: number;
};

export type LoggerOptions = {
  logFormat?: LogFormats;
  logLevel?: LogLevels;
};
