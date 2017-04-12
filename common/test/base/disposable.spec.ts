// tslint:disable:max-classes-per-file
// tslint:disable:member-access

// -------------------------------------- logging --------------------------------------------
import { using } from '../../src/base/disposable';
import { levels } from '../../src/diagnostics/level';
import { getLogger } from '../../src/diagnostics/logger';
// tslint:disable-next-line:no-unused-variable
import { ILogger } from '../../src/diagnostics/logger.interface';
import { XLog } from '../../src/diagnostics/xlog';
// -------------------------------------- logging --------------------------------------------

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { Disposable } from '../../src/base/disposable';
import { NotImplementedException } from '../../src/exceptions/notImplementedException';

class Test extends Disposable {
  protected static readonly logger = getLogger(Test);

  constructor(public messages: string[]) {
    super();
    using(new XLog(Test.logger, levels.INFO, 'ctor'), (log) => {
      this.messages.push('ctor');
    });
  }


  public throwException() {
    throw new NotImplementedException();
  }

  protected onDispose() {
    using(new XLog(Test.logger, levels.INFO, 'onDispose'), (log) => {
      try {
        this.messages.push('onDispose');
      } finally {
        super.onDispose();
      }
    });
  }
}



@suite('Disposable')
class DisposableTest {

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
    using(new Test(messages), (test) => {
      // ok
    });

    expect(messages.length).to.equal(2);
    expect(messages[0]).to.equal('ctor');
    expect(messages[1]).to.equal('onDispose');
  }

  @test 'should throw exception'() {
    const messages = [];

    expect(() => {
      using(new Test(messages), (test) => {
        test.throwException();
      });

    }).to.throw(NotImplementedException);
  }


}