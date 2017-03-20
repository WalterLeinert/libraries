// tslint:disable:max-classes-per-file
// tslint:disable:member-access

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { AssertionException } from '../../src/exceptions/assertionException';
import { Exception } from '../../src/exceptions/exception';
import { ServerBusinessException } from '../../src/exceptions/serverBusinessException';


@suite('Exceptions: encoding')
class ExceptionEncodingTest {

  @test 'should encode/decode simple exception'() {
    const message = 'exception test message';
    const exc = new ServerBusinessException(message);
    const encodedExc = exc.encodeException();

    expect(encodedExc).to.equal(`{exc:ServerBusinessException::${message}::}`);

    const decodedExc = Exception.decodeException(encodedExc);
    expect(decodedExc).to.be.instanceof(ServerBusinessException);
    expect(decodedExc.message).to.equal(message);
  }

  @test 'should encode/decode exception with inner exc'() {
    const assertionMessage = 'name is empty';
    const inner = new AssertionException(assertionMessage);

    const message = 'exception test message';
    const exc = new ServerBusinessException(message, inner);
    const encodedExc = exc.encodeException();


    expect(encodedExc).to.equal(`{exc:ServerBusinessException::${message}::` +
      `{exc:AssertionException::${assertionMessage}::}}`);

    const decodedExc = Exception.decodeException(encodedExc) as Exception;
    expect(decodedExc).to.be.instanceof(ServerBusinessException);
    expect(decodedExc.innerException).not.be.undefined;
    expect(decodedExc.innerException).to.be.instanceof(AssertionException);
    expect(decodedExc.innerException.message).to.equal(assertionMessage);
  }

}