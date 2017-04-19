// tslint:disable:member-access
// tslint:disable:max-classes-per-file

import { getLogger, ILevel, levels, using, XLog } from '@fluxgate/platform';
import { expect } from 'chai';
import { /*only,*/ suite, test } from 'mocha-typescript';

import { BaseTest } from '../../src/testing/baseTest';

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


/**
 * Konfiguration über ../config/log4js.local.json
 *
 * @class LoggerConfigFileTest
 */
@suite('Logger configfile')
class LoggerConfigFileTest extends BaseTest {


  @test 'should test log level for Test'() {
    // Hinweis: die Level-Instanzen sind unterschiedlich (Level <-> log4js.Level)
    expect(Test.logger.level.isEqualTo(levels.TRACE)).to.be.true;
  }

  @test 'should test log level for Test2'() {
    expect(Test2.logger.level.isEqualTo(levels.INFO)).to.be.true;
  }

  @test 'should test log level for Test3'() {
    expect(Test3.logger.level.isEqualTo(levels.ERROR)).to.be.true;
  }

  protected static before(done: (err?: any) => void) {
    super.before((err?: any) => {
      if (err) {
        done(err);
      }

      BaseTest.initializeLogging('common', {
        relativePath: 'common/test/config'
      });
      done();
    });
  }

  // protected before() {
  //   // Logging konfigurieren ...
  //   const systemMode = fromEnvironment('NODE_ENV', 'development');
  //   Logging.configureLogging('common', {
  //     systemMode: systemMode,
  //     relativePath: 'test/config'
  //   });
  // }

}