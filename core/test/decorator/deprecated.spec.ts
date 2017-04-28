// tslint:disable:member-access
// tslint:disable:max-classes-per-file

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { Deprecated } from '../../src/decorator/';
import { configure, IConfig } from '../../src/diagnostics/';

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



@suite('core.decorator.deprecated')
class DeprecatedTest {
  config: IConfig = {
    appenders: [

    ],

    levels: {
      '[all]': 'WARN'
    }
  };

  @test 'should initiate deprecated warnings by diagnostics logging'() {
    const test = new Test();
    const level = test.getLogLevel();
    expect(level).to.equal(0);

    const test2 = new Test2();
    expect(test2).to.exist;
  }


  protected before() {
    configure(this.config);
  }
}