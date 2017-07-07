// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { configure, getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------


import {
  CoreInjector, DEFAULT_CATEGORY, LOGGER, LOG_EXCEPTIONS, fromEnvironment,
  STRINGIFYER, Types, UnitTest
} from '@fluxgate/core';

import { AppConfig } from '../base/appConfig';
import { EntityStringifyer } from '../model/entity-stringifyer';
import { Logging } from '../util/logging';
import { ILoggingConfigurationOptions } from '../util/loggingConfiguration';


/**
 * Basisklasse für alle Unit-Tests
 */
export abstract class BaseTest extends UnitTest {
  protected static readonly logger = getLogger(BaseTest);


  /**
   * wird einmal vor allen Tests ausgeführt
   */
  protected static before(done?: (err?: any) => void) {
    using(new XLog(BaseTest.logger, levels.DEBUG, 'static.before'), (log) => {
      done();
    });
  }


  protected static after(done?: (err?: any) => void) {
    // tslint:disable-next-line:no-empty
    using(new XLog(BaseTest.logger, levels.DEBUG, 'static.after'), (log) => {
      done();
    });
  }


  public static initializeLogging(packageName: string = 'testing',
    configurationOptions?: ILoggingConfigurationOptions) {

    using(new XLog(BaseTest.logger, levels.DEBUG, 'initializeLogging',
      `packageName = ${packageName}, configuration = ${configurationOptions}`), (log) => {
        if (!Types.isPresent(configurationOptions)) {
          configurationOptions = {
            systemMode: fromEnvironment('NODE_ENV', 'development'),
            relativePath: 'test/config'
          };
        }

        Logging.configureLogging(packageName, configurationOptions);
      });
  }


  protected before(done?: (err?: any) => void) {
    super.before();
    // tslint:disable-next-line:no-empty
    using(new XLog(BaseTest.logger, levels.DEBUG, 'before'), (log) => {
      BaseTest.initializeLogging();

      CoreInjector.instance.resolveAndCreate([
        { provide: DEFAULT_CATEGORY, useValue: BaseTest.logger.category },
        { provide: LOGGER, useValue: BaseTest.logger },
        { provide: LOG_EXCEPTIONS, useValue: false },
        { provide: STRINGIFYER, useClass: EntityStringifyer }   // -> resetSecrets
      ]);


      if (AppConfig.config) {
        AppConfig.config.cacheManagerConfiguration = {
          cacheType: 'lru',
          configurations: [
            {
              model: '',
              options: {
                maxItems: 1
              }
            }

          ]
        };

      } else {

        //
        // Konfiguration für Tests registrieren
        // hier nur wichtig: cacheManagerConfiguration
        //
        AppConfig.register({
          url: '',
          printTopic: '',
          mode: 'development',
          printUrl: '',
          proxyMode: 'nop',
          cacheManagerConfiguration: {
            cacheType: 'lru',
            configurations: [
              {
                model: '',
                options: {
                  maxItems: 1
                }
              }

            ]
          }
        });
      }

      done();
    });
  }

  protected after(done?: (err?: any) => void) {
    // tslint:disable-next-line:no-empty
    using(new XLog(BaseTest.logger, levels.DEBUG, 'after'), (log) => {
      AppConfig.unregister();
      done();
    });
  }

}