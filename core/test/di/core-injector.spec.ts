// tslint:disable:max-classes-per-file
// tslint:disable:member-access
// tslint:disable:no-unused-expression

import { Injectable, InjectionToken, ReflectiveInjector } from 'injection-js';

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { CoreInjector } from '../../src/di/core-injector';
import { UnitTest } from '../../src/testing/unit-test';

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



const staticInjector = ReflectiveInjector.resolveAndCreate([
  { provide: LOGGER, useClass: ConsoleLogger }
]);

CoreInjector.instance.setInjector(staticInjector);


class StaticLoggerTest {
  public static readonly logger: ILogger = CoreInjector.instance.getInstance<ILogger>(LOGGER);

  public doLog(message: string) {
    StaticLoggerTest.logger.log(message);
  }
}




@suite('core.exceptions.di: test CoreInjector')
class CoreInjectorTest extends UnitTest {

  @test 'should create ConsoleLogger by token'() {
    const injector = ReflectiveInjector.resolveAndCreate([
      { provide: LOGGER, useClass: ConsoleLogger }
    ]);

    CoreInjector.instance.setInjector(injector);

    const test = new LoggerTest();
    test.doLog('hallo');

    expect(test.logger).to.be.instanceof(ConsoleLogger);
  }


  @test 'should create DateLogger by token'() {
    const injector = ReflectiveInjector.resolveAndCreate([
      { provide: LOGGER, useClass: DateLogger }
    ]);

    CoreInjector.instance.setInjector(injector);

    const test = new LoggerTest();
    test.doLog('hallo');

    expect(test.logger).to.be.instanceof(DateLogger);
  }


  @test 'should create static ConsoleLogger by token'() {
    const test = new StaticLoggerTest();
    test.doLog('hallo');

    expect(StaticLoggerTest.logger).to.be.instanceof(ConsoleLogger);
  }
}

