// -------------------------------------- logging --------------------------------------------
import { IConfig } from '../../src/diagnostics/config.interface';
import { configure } from '../../src/diagnostics/logging-core';
// -------------------------------------- logging --------------------------------------------


/**
 * abstrakte Basisklasse für alle DI-Unittests.
 *
 * @export
 * @abstract
 * @class DiUnitTest
 */
export abstract class DiUnitTest {

  //
  // Default Loggingkonfiguration für alle Tests
  //
  private static DEFAULT_LOGGING_CONFIGURATION: IConfig = {
    appenders: [
    ],

    levels: {
      '[all]': 'WARN'
    }
  };


  public static configureLogging(config: IConfig = DiUnitTest.DEFAULT_LOGGING_CONFIGURATION) {
    configure(config);
  }

  protected static before() {
    DiUnitTest.configureLogging();
  }
}