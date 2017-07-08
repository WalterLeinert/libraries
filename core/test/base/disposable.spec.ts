// tslint:disable:max-classes-per-file
// tslint:disable:member-access
// tslint:disable:no-unused-expression

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { Disposable, using } from '../../src/base/disposable';
import { NotImplementedException } from '../../src/exceptions/notImplementedException';
import { UnitTest } from '../../src/testing/unit-test';

class Test extends Disposable {

  constructor(public messages: string[]) {
    super();
    this.messages.push('ctor');
  }


  public throwException() {
    throw new NotImplementedException();
  }

  protected onDispose() {
    try {
      this.messages.push('onDispose');
    } finally {
      super.onDispose();
    }
  }
}



@suite('core.base.Disposable')
class DisposableTest extends UnitTest {

  @test 'should create instance of class Test'() {
    const messages = [];
    const expectedTest = new Test(messages);

    expect(expectedTest).to.be.not.null;
    expect(messages).not.to.be.empty;
    expect(messages.length).to.equal(1);
    expect(messages[0]).to.equal('ctor');
  }


  @test 'should have 3 messages'() {
    const messages = [];
    using(new Test(messages), () => {
      // ok
    });

    expect(messages.length).to.equal(2);
    expect(messages[0]).to.equal('ctor');
    expect(messages[1]).to.equal('onDispose');
  }

  @test 'should throw exception'() {
    const messages = [];

    expect(() => {
      using(new Test(messages), (tst) => {
        tst.throwException();
      });

    }).to.throw(NotImplementedException);
  }


}