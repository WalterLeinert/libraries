// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { configure, getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

import { Assert, fromEnvironment, Types, Utility } from '@fluxgate/core';
import { FileSystem } from '@fluxgate/platform';


// Fluxgate
import { ILoggingConfigurationOptions, LoggingConfiguration } from './loggingConfiguration';


export class Logging {
  protected static readonly logger = getLogger(Logging);


  /**
   * Konfiguriert das Log4js-Logging
   */
  public static configureLogging(packageName: string, info: string | ILoggingConfigurationOptions) {
    Assert.notNullOrEmpty(packageName);
    Assert.notNull(info);

    using(new XLog(Logging.logger, levels.INFO, 'configureLogging'), (log) => {
      let configOptions: ILoggingConfigurationOptions;

      if (Types.isString(info)) {
        configOptions = {
          systemMode: info as string
        };
      } else {
        configOptions = info;
      }

      if (Utility.isNullOrEmpty(configOptions.systemMode)) {
        configOptions.systemMode = fromEnvironment('NODE_ENV', 'development');
      }

      const configPath = LoggingConfiguration.getConfigurationPath(configOptions);

      if (FileSystem.fileExists(configPath)) {
        // configure(configPath, { reloadSecs: 10 });
        configure(configPath);

        log.info(`[${packageName}]: logging: systemMode = ${configOptions.systemMode}, configPath = ${configPath}`);
      } else {
        log.warn(`[${packageName}]: logging: cannot read configuration: ${configPath}`);
      }

    });
  }

}