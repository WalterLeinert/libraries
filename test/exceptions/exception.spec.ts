// tslint:disable:max-classes-per-file
// tslint:disable:member-access

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

// import { Error } from '../../src/exceptions/error';
import { Exception } from '../../src/exceptions/exception';
import { NotSupportedException } from '../../src/exceptions/notSupportedException';


@suite('Exceptions')
class ExceptionTest {

  @test 'should throw NotSupportedException'() {
    const messageExpected = 'not supported';
    try {
      throw new NotSupportedException(messageExpected);
    } catch (exc) {
      expect(exc).to.be.instanceof(Exception);
      expect(exc).to.be.instanceof(NotSupportedException);

      expect(exc.message).to.equal(messageExpected);
    }
  }

  @test 'should expect NotSupportedException'() {
    const messageExpected = 'not supported';
    expect(() => {
      throw new NotSupportedException(messageExpected);
    }).to.throw(NotSupportedException, messageExpected);

    expect(() => {
      throw new NotSupportedException(messageExpected);
    }).to.throw(NotSupportedException, messageExpected);
  }
}