// tslint:disable:member-access
// tslint:disable:max-classes-per-file
// tslint:disable:no-unused-expression

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { configure, getLogger, IConfig, ILevel, levels, using, XLog } from '@fluxgate/platform';

import { CommonTest } from '../common.spec';


class Test {
  public static readonly logger = getLogger(Test);

  constructor(name: string) {
    using(new XLog(Test.logger, levels.INFO, 'ctor'), (log) => {
      // ok
    });
  }

  public getLogLevel(): ILevel {
    return using(new XLog(Test.logger, levels.INFO, 'getLogLevel'), (log) => {
      return log.level;
    });
  }
}

class Test2 {
  public static readonly logger = getLogger(Test2);

  constructor(name: string) {
    using(new XLog(Test2.logger, levels.INFO, 'ctor'), (log) => {
      // ok
    });
  }


  public getLogLevel(): ILevel {
    return using(new XLog(Test2.logger, levels.INFO, 'getLogLevel'), (log) => {
      return log.level;
    });
  }
}

class Test3 {
  public static readonly logger = getLogger(Test3);

  constructor(name: string) {
    using(new XLog(Test3.logger, levels.INFO, 'ctor'), (log) => {
      // ok
    });
  }


  public getLogLevel(): ILevel {
    return using(new XLog(Test3.logger, levels.INFO, 'getLogLevel'), (log) => {
      return log.level;
    });
  }
}



@suite('Logger')
class LoggerTest extends CommonTest {

  @test 'should create logger'() {
    const logger = getLogger('test');
    return expect(logger).to.be.not.null;
  }

  @test 'should set level DEBUG'() {
    const logger = getLogger('test');
    logger.setLevel(levels.DEBUG);
    return expect(logger.isDebugEnabled()).to.be.true;
  }

  @test 'should set level "DEBUG"'() {
    const logger = getLogger('test');
    logger.setLevel('DEBUG');
    return expect(logger.isDebugEnabled()).to.be.true;
  }

  @test 'should log DEBUG message'() {
    const logger = getLogger('test');
    logger.setLevel('DEBUG');
    return expect(() => logger.debug('debug message')).not.to.Throw();
  }

  @test 'should set level WARN'() {
    const logger = getLogger('test');
    logger.setLevel(levels.WARN);
    expect(logger.isWarnEnabled()).to.be.true;
    expect(logger.isInfoEnabled()).to.be.false;
  }
}

@suite('Logger config')
class LoggerConfigTest extends CommonTest {

  config: IConfig = {
    appenders: [

    ],

    levels: {
      '[all]': 'WARN',
      'Test': 'DEBUG',
      'Test2': 'INFO'
    }
  };



  @test 'should test log level for Test'() {
    // tslint:disable-next-line:no-unused-variable
    const tester = new Test('hirsch');

    // Hinweis: die Level-Instanzen sind unterschiedlich (Level <-> log4js.Level)
    expect(Test.logger.level.isEqualTo(levels.DEBUG)).to.be.true;
  }

  @test 'should test log level for Test2'() {
    // tslint:disable-next-line:no-unused-variable
    const tester = new Test2('hirsch');
    expect(Test2.logger.level.isEqualTo(levels.INFO)).to.be.true;
  }

  @test 'should test log level for Test3'() {
    // tslint:disable-next-line:no-unused-variable
    const tester = new Test3('hirsch');
    // expect(Test3.logger.level.isEqualTo(levels.WARN)).to.be.true;
    expect(Test3.logger.level.toString()).to.equal(levels.WARN.toString());
  }

  protected before(done?: (err?: any) => void) {
    super.before(() => {
      configure(this.config);
      done();
    });
  }

}


@suite('Logger extended')
class LoggerExtendedTest extends CommonTest {

  @test 'should create Test instance'() {
    const tester = new Test('hugo');
    expect(tester).to.be.not.null;
  }

  @test 'should create Test2 instance'() {
    const tester = new Test2('hirsch');
    expect(tester).to.be.not.null;
  }

  @test 'should test Test2.getLogLevel'() {
    const tester = new Test2('hirsch');
    expect(tester.getLogLevel()).to.be.equal(levels.INFO);
  }
}