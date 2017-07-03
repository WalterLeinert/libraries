// tslint:disable:max-classes-per-file
// tslint:disable:member-access
// tslint:disable:no-unused-expression

import { suite, test } from 'mocha-typescript';

import { AssertionException } from '../../src/exceptions/assertionException';
import { Exception } from '../../src/exceptions/exception';
import { UnitTest } from '../../src/testing/unit-test';



@suite('core.exceptions: should log exception')
class LogExceptionTests extends UnitTest {

  @test 'should log exception'() {
    const logException = Exception.logException;

    try {
      Exception.logException = true;
      throw new AssertionException('should be an assertion');
    } catch (exc) {
      // ok
    } finally {
      Exception.logException = logException;
    }
  }
}