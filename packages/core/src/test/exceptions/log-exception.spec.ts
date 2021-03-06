// tslint:disable:max-classes-per-file
// tslint:disable:member-access
// tslint:disable:no-unused-expression

import { suite, test } from 'mocha-typescript';

import { CoreInjector } from '../../lib/di/core-injector';
import { ConsoleLogger } from '../../lib/diagnostics/consoleLogger';
import { DEFAULT_CATEGORY, LOG_EXCEPTIONS, LOGGER } from '../../lib/diagnostics/logger.token';
import { AssertionException } from '../../lib/exceptions/assertionException';
import { CoreUnitTest } from '../unit-test';


@suite('core.exceptions: should log exception')
class LogExceptionTests extends CoreUnitTest {

  @test 'should log exception'() {
    try {
      throw new AssertionException('should be an assertion');
    } catch (exc) {
      // ok
    }
  }


  public before() {
    super.before();

    CoreInjector.instance.resolveAndCreate([
      { provide: DEFAULT_CATEGORY, useValue: '-unknown-' },
      { provide: LOGGER, useClass: ConsoleLogger },
      { provide: LOG_EXCEPTIONS, useValue: true }
    ]);
  }
}