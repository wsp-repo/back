import { Module, DynamicModule, OnModuleInit } from '@nestjs/common';

import { initDecorators } from './decorators/bootstrap';
import { ConfigEnvironments, ConfigYamlFiles } from './loaders';
import { ConfigStorage } from './storage';

import { ConfigLoader, ConfigSources } from './types';

let moduleInstanceCreated = false;

const injectKeyPrefix = 'CONFIG_MODULE_LOADER';

const loadersMap = {
  [ConfigSources.Environments]: ConfigEnvironments,
  [ConfigSources.YamlFiles]: ConfigYamlFiles,
};

function loaderInjectKey(source: ConfigSources): string {
  return `${injectKeyPrefix}_${source}`.replace(/[^\d\w]+/g, '_').toUpperCase();
}

@Module({})
export class ConfigModule implements OnModuleInit {
  public static createModule(
    sources: ConfigSources[] = [ConfigSources.YamlFiles],
  ): DynamicModule {
    if (moduleInstanceCreated) {
      throw new Error('NameModule is a singleton');
    }

    const sourceProviders = sources.map((source) => ({
      provide: loaderInjectKey(source),
      useClass: loadersMap[source],
    }));

    moduleInstanceCreated = true;

    return {
      module: ConfigModule,
      providers: [
        ConfigStorage,
        ...sourceProviders,
        {
          provide: `${injectKeyPrefix}S`,
          useFactory: (...loaders: ConfigLoader[]) => loaders,
          inject: sources.map(loaderInjectKey),
        },
      ],
      exports: [ConfigStorage],
      global: true,
    };
  }

  public static isModuleCreated(): boolean {
    return moduleInstanceCreated;
  }

  public onModuleInit(): void {
    initDecorators();
  }
}
