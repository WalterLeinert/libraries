// tslint:disable:max-classes-per-file
// tslint:disable:member-access
// tslint:disable:no-unused-expression

import { suite, test } from 'mocha-typescript';

import { CoreInjector } from '../../src/di/core-injector';
import { ConsoleLogger } from '../../src/diagnostics/consoleLogger';
import { DEFAULT_CATEGORY, LOG_EXCEPTIONS, LOGGER } from '../../src/diagnostics/logger.token';
import { AssertionException } from '../../src/exceptions/assertionException';
import { Exception } from '../../src/exceptions/exception';
import { UnitTest } from '../../src/testing/unit-test';


@suite('core.exceptions: should log exception')
class LogExceptionTests extends UnitTest {

  @test 'should log exception'() {
    try {
      throw new AssertionException('should be an assertion');
    } catch (exc) {
      // ok
    }
  }


  public before() {
    super.before();

    const injector = CoreInjector.instance.resolveAndCreate([
      { provide: DEFAULT_CATEGORY, useValue: '-unknown-' },
      { provide: LOGGER, useClass: ConsoleLogger },
      { provide: LOG_EXCEPTIONS, useValue: true }
    ]);
  }
}