import * as fs from 'fs';
import 'reflect-metadata';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import {
  configure, getLogger, IConfig, ILogger, ILoggingConfigurationOptions,
  levels, LoggingConfiguration, using, XLog
} from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

import { Assert, fromEnvironment, Types, Utility } from '@fluxgate/core';

import { CommonUnitTest } from '../lib/testing/unit-test';


/**
 * Basisklasse für Tests im Bereich common. Intialisiert das Logging
 *
 * @class CommonTest
 */
export class CommonTest extends CommonUnitTest {

  public static configureLogging(packageName: string, info: ILoggingConfigurationOptions) {
    Assert.notNullOrEmpty(packageName);
    Assert.notNull(info);

    using(new XLog(CommonTest.logger, levels.INFO, 'configureLogging'), (log) => {
      let configOptions: ILoggingConfigurationOptions;

      if (Types.isString(info)) {
        configOptions = {
          systemMode: info as string
        };
      } else {
        configOptions = info as ILoggingConfigurationOptions;
      }

      if (Utility.isNullOrEmpty(configOptions.systemMode)) {
        configOptions.systemMode = fromEnvironment('NODE_ENV', 'development');
      }

      const configPath = LoggingConfiguration.getConfigurationPath(configOptions);

      if (fs.existsSync(configPath)) {
        const data = fs.readFileSync(configPath);
        const config = JSON.parse(data.toString()) as IConfig;

        configure(config);

        log.info(`[${packageName}]: logging: systemMode = ${configOptions.systemMode}, configPath = ${configPath}`);
      } else {
        log.warn(`[${packageName}]: logging: cannot read configuration: ${configPath}`);
      }

    });
  }


  protected static before(done: (err?: any) => void) {
    super.before((err?: any) => {
      if (err) {
        done(err);
      }

      CommonTest.configureLogging('common', {
        relativePath: 'src/test/config'
      });
      done();
    });
  }
}