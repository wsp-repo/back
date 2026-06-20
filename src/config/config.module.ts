import { Module, DynamicModule } from '@nestjs/common';

import { initDecorators } from './decorators/bootstrap';
import { ConfigEnvironments, ConfigYamlFiles } from './loaders';
import { cleanConfig, setReadyConfig } from './storage';

import { ConfigSources } from './types';

let moduleInstanceCreated = false;

const loadersMap = {
  [ConfigSources.Environments]: ConfigEnvironments,
  [ConfigSources.YamlFiles]: ConfigYamlFiles,
};

@Module({})
export class ConfigModule {
  public static createModule(
    sources: ConfigSources[] = [ConfigSources.YamlFiles],
  ): DynamicModule {
    if (moduleInstanceCreated) {
      throw new Error('ConfigModule is a singleton');
    }

    try {
      for (const source of sources) {
        const loaderClass = loadersMap[source];

        new loaderClass().loadConfig();
      }

      setReadyConfig();
      initDecorators();
    } catch (error) {
      cleanConfig();

      throw error;
    }

    moduleInstanceCreated = true;

    return {
      module: ConfigModule,
      global: true,
    };
  }

  public static isModuleCreated(): boolean {
    return moduleInstanceCreated;
  }
}
