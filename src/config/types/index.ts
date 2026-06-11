import { TSchema } from '@zalib/core';

// eslint-disable-next-line
export type ConfigLoader = {};

export enum ConfigSources {
  Environments = 'environments',
  YamlFiles = 'yaml-files',
}

export type ConfigOptions = {
  optional?: boolean;
  schema: TSchema;
};
