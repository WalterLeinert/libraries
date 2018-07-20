// tslint:disable:member-access
// tslint:disable:max-classes-per-file
// tslint:disable:no-unused-expression

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { Deprecated } from '../../lib/decorator/';
import { configure, IConfig } from '../../lib/diagnostics/';
import { CoreUnitTest } from '../unit-test';

const tester = (doTest: (test: any, test2: any, test3: any) => void) => {
  @Deprecated()
  class Test {
    @Deprecated('logger nicht mehr verwenden')
    public static readonly logger;


    @Deprecated('', false)
    public getLogLevel(): number {
      return 0;
    }
  }


  @Deprecated('durch Test3 ersetzen', false)
  class Test2 {
  }

  class Test3 {
  }

  doTest(Test, Test2, Test3);
};




@suite('core.decorator.Deprecated')
class DeprecatedTest extends CoreUnitTest {
  config: IConfig = {
    appenders: [
    ],

    levels: {
      Deprecated: 'ERROR'     // auf WARN setzen, um Output zu bekommen
    }
  };

  @test 'should initiate deprecated warnings by diagnostics logging'() {

    tester((test1, test2, test3) => {
      const t = new test1();
      const level = t.getLogLevel();
      expect(level).to.equal(0);

      const t2 = new test2();
      expect(t2).to.exist;
    });

  }


  protected before() {
    configure(this.config);
  }
}