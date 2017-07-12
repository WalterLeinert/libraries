import 'reflect-metadata';

import { CommonUnitTest } from '../src/testing/unit-test';

/**
 * Basisklasse für Tests im Bereich common. Intialisiert das Logging
 *
 * @class CommonTest
 */
export class CommonTest extends CommonUnitTest {

  protected static before(done: (err?: any) => void) {
    super.before((err?: any) => {
      if (err) {
        done(err);
      }

      CommonUnitTest.initializeLogging('common', {
        relativePath: 'test/config'
      });
      done();
    });
  }
}