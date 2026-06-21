export interface ConfigLoader {
  loadConfig(): void;
}

export enum ConfigSources {
  Environments = 'environments',
  YamlFiles = 'yaml-files',
}
