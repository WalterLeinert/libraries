import { BaseTest } from '../src/testing/baseTest';

/**
 * Basisklasse für Tests im Bereich common. Intialisiert das Logging
 *
 * @class LoggerConfigFileTest
 */
export class CommonTest extends BaseTest {

  protected static before(done: (err?: any) => void) {
    super.before((err?: any) => {
      if (err) {
        done(err);
      }

      BaseTest.initializeLogging('common', {
        relativePath: 'common/test/config'
      });
      done();
    });
  }
}