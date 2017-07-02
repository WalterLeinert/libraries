// tslint:disable:max-classes-per-file
// tslint:disable:member-access
// tslint:disable:no-unused-expression

import { Injectable, InjectionToken, ReflectiveInjector } from 'injection-js';

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

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


@suite('core.exceptions.di: test resolveAndCreate')
class InjectionTest extends UnitTest {

  @test 'should create loggers'() {
    const injector = ReflectiveInjector.resolveAndCreate([ConsoleLogger, DateLogger]);
    const consoleLogger = injector.get(ConsoleLogger);
    const dateLogger = injector.get(DateLogger);

    consoleLogger.log('hallo');
    dateLogger.log('hallo');
  }
}



@suite('core.exceptions.di: test resolveAndCreate by token')
class InjectionTokenTest extends UnitTest {

  @test 'should create ConsoleLogger by token'() {
    const injector = ReflectiveInjector.resolveAndCreate([
      ConsoleLogger, { provide: LOGGER, useClass: ConsoleLogger }
    ]);
    const logger = injector.get(LOGGER);

    expect(logger).to.be.instanceof(ConsoleLogger);
  }

  @test 'should create DateLogger by token'() {
    const injector = ReflectiveInjector.resolveAndCreate([
      DateLogger, { provide: LOGGER, useClass: DateLogger }
    ]);
    const logger = injector.get(LOGGER);

    expect(logger).to.be.instanceof(DateLogger);
  }
}