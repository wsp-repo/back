import { TSchema } from '@zalib/core';

export interface ConfigLoader {
  loadConfig(): void;
}

export enum ConfigSources {
  Environments = 'environments',
  YamlFiles = 'yaml-files',
}

export type ConfigOptions = {
  optional?: boolean;
  schema: TSchema;
};
