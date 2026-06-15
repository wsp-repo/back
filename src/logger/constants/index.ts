import { LogFormats, LogLevels } from '../types';

export const LOG_FORMATS_KEYS = Object.values(LogFormats) as string[];

export const LOG_LEVELS_KEYS = Object.values(LogLevels) as string[];

export const LOG_LEVEL_TRACE = 10;
export const LOG_LEVEL_DEBUG = 20;
export const LOG_LEVEL_INFO = 30;
export const LOG_LEVEL_WARN = 40;
export const LOG_LEVEL_ERROR = 50;
export const LOG_LEVEL_FATAL = 60;

export const LOG_LEVELS_NUMS = {
  [LogLevels.Trace]: LOG_LEVEL_TRACE,
  [LogLevels.Debug]: LOG_LEVEL_DEBUG,
  [LogLevels.Info]: LOG_LEVEL_INFO,
  [LogLevels.Warn]: LOG_LEVEL_WARN,
  [LogLevels.Error]: LOG_LEVEL_ERROR,
  [LogLevels.Fatal]: LOG_LEVEL_FATAL,
};
