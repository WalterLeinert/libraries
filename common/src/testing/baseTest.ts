// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { configure, getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

import { fromEnvironment, Types } from '@fluxgate/core';

import { Logging } from '../util/logging';
import { ILoggingConfigurationOptions } from '../util/loggingConfiguration';


/**
 * Basisklasse für alle Unit-Tests
 */
export abstract class BaseTest {
  protected static readonly logger = getLogger(BaseTest);


  /**
   * wird einmal vor allen Tests ausgeführt
   */
  protected static before(done: () => void) {
    using(new XLog(BaseTest.logger, levels.DEBUG, 'static.before'), (log) => {
      BaseTest.initializeLogging();
      done();
    });
  }


  protected static after(done: () => void) {
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


  protected before() {
    // tslint:disable-next-line:no-empty
    using(new XLog(BaseTest.logger, levels.DEBUG, 'before'), (log) => {
    });
  }

  protected after() {
    // tslint:disable-next-line:no-empty
    using(new XLog(BaseTest.logger, levels.DEBUG, 'after'), (log) => {
    });
  }

}