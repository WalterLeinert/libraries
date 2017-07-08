// tslint:disable:max-classes-per-file
// tslint:disable:member-access
// tslint:disable:no-unused-expression

import 'reflect-metadata';

import { Injectable, InjectionToken, ReflectiveInjector } from 'injection-js';

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';


import { Container } from '../../src/di/container';
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

@Injectable()
class LoggerFaccade {
  constructor(private logger: Logger) {
  }

  public doLog(message: string) {
    this.logger.log(message);
  }
}



@suite('core.di.Container')
class ContainerTest extends UnitTest {

  @test 'should create root injector'() {
    const container = new Container();
    const injector = container.resolveAndCreate([
    ]);

    expect(injector).to.be.not.null;
  }


  @test 'should create ConsoleLogger by token'() {
    const container = new Container();
    const injector = container.resolveAndCreate([
      { provide: LOGGER, useClass: ConsoleLogger }
    ]);    // neuen Root-Injector erzeugen
    const logger = injector.get(LOGGER);

    expect(logger).to.be.instanceof(ConsoleLogger);
  }


  @test 'should create test child container'() {
    const childContainer = new Container();

    const container = new Container([
      childContainer
    ]
    );

    container.resolveAndCreate([
      { provide: LOGGER, useClass: ConsoleLogger }
    ]);

    const logger = container.getInstance(LOGGER);
    expect(logger).to.be.instanceof(ConsoleLogger);
  }


  @test 'should resolve by child container'() {
    const childContainer = new Container();

    const container = new Container([
      childContainer
    ]
    );

    container.resolveAndCreate([
      { provide: LOGGER, useClass: ConsoleLogger }
    ]);


    const logger = childContainer.getInstance(LOGGER);
    expect(logger).to.be.instanceof(ConsoleLogger);
  }


  @test 'should resolve by child container 2'() {
    const childContainer = new Container();

    const container = new Container([
      childContainer
    ]
    );

    childContainer.resolveAndCreate([
      { provide: LOGGER, useClass: ConsoleLogger }
    ]);

    const logger = childContainer.getInstance(LOGGER);
    expect(logger).to.be.instanceof(ConsoleLogger);
  }

  @test 'should not resolve by parent container'() {
    const childContainer = new Container();

    const container = new Container([
      childContainer
    ]
    );

    childContainer.resolveAndCreate([
      { provide: LOGGER, useClass: ConsoleLogger }
    ]);

    expect(() => container.getInstance(LOGGER)).to.Throw();
  }


  @test 'should override by child container'() {
    const childContainer = new Container();

    const container = new Container([
      childContainer
    ]
    );

    container.resolveAndCreate([
      { provide: LOGGER, useClass: ConsoleLogger }
    ]);

    childContainer.resolveAndCreate([
      { provide: LOGGER, useClass: DateLogger }
    ]);


    const logger = childContainer.getInstance(LOGGER);
    expect(logger).to.be.instanceof(DateLogger);
  }


  @test 'should eresolve loging facade'() {
    const childContainer = new Container();

    const container = new Container([
      childContainer
    ]
    );

    container.resolveAndCreate([
      { provide: LOGGER, useClass: ConsoleLogger }
    ]);

    childContainer.resolveAndCreate([
      { provide: LoggerFaccade }
    ]);


    const logger = childContainer.getInstance(LoggerFaccade);
    expect(logger).to.be.not.null;
  }
}