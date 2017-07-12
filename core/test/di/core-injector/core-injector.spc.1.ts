// tslint:disable:max-classes-per-file
// tslint:disable:member-access
// tslint:disable:no-unused-expression

import { Injectable, InjectionToken, Injector } from 'injection-js';

import { expect } from 'chai';
import { only, suite, test } from 'mocha-typescript';

import { CoreInjector } from '../../../src/di/core-injector';
import { FlxModule } from '../../../src/di/flx-module.decorator';
import { ModuleMetadataStorage } from '../../../src/di/module-metadata-storage';
import { CoreUnitTest } from '../../../src/testing/unit-test';

export const LOGGER = new InjectionToken<ILogger>('logger');

export interface ILogger {
  log(message: string);
}

@Injectable()
export class Logger implements ILogger {
  public log(message: string) {
    //
  }
}

@Injectable()
export class ConsoleLogger extends Logger {
  public log(message: string) {
    // tslint:disable-next-line:no-console
    console.log(message);
  }
}

@Injectable()
export class DateLogger extends Logger {
  public log(message: string) {
    // tslint:disable-next-line:no-console
    console.log(new Date() + ': ' + message);
  }
}



class LoggerTest {
  public logger: ILogger = CoreInjector.instance.getInstance<ILogger>(LOGGER);

  public doLog(message: string) {
    this.logger.log(message);
  }
}


class StaticLoggerTest {
  public static readonly logger: ILogger = CoreInjector.instance.getInstance<ILogger>(LOGGER);

  public doLog(message: string) {
    StaticLoggerTest.logger.log(message);
  }
}


@FlxModule({
  providers: [
    { provide: LOGGER, useClass: ConsoleLogger }
  ]

})
class CoreInjectorTestModule {

  constructor(injector: Injector) {
    CoreInjector.instance.setInjector(injector);
  }
}



@suite('core.exceptions.di: test CoreInjector')
class CoreInjectorTest extends CoreUnitTest {
  private rootInstance: CoreInjectorTestModule;

  @test 'should create ConsoleLogger by token'() {
    CoreInjector.instance.resolveAndCreate([
      { provide: LOGGER, useClass: ConsoleLogger }
    ]);

    const tester = new LoggerTest();
    tester.doLog('hallo');

    expect(tester.logger).to.be.instanceof(ConsoleLogger);
  }


  @test 'should create DateLogger by token'() {
    CoreInjector.instance.resolveAndCreate([
      { provide: LOGGER, useClass: DateLogger }
    ]);

    const tester = new LoggerTest();
    tester.doLog('hallo');

    expect(tester.logger).to.be.instanceof(DateLogger);
  }


  @test 'should create static ConsoleLogger by token'() {
    const tester = new StaticLoggerTest();
    tester.doLog('hallo');

    expect(StaticLoggerTest.logger).to.be.instanceof(ConsoleLogger);
  }


  protected before() {
    this.rootInstance = ModuleMetadataStorage.instance.bootstrapModule(CoreInjectorTestModule);
  }
}

