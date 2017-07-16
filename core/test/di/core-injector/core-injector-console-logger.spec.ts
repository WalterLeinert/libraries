// tslint:disable:max-classes-per-file
// tslint:disable:member-access
// tslint:disable:no-unused-expression

import { Injectable, InjectionToken, Injector } from 'injection-js';

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { IConfig } from '../../../src/diagnostics/config.interface';

import { CoreInjector } from '../../../src/di/core-injector';
import { FlxComponent } from '../../../src/di/flx-component.decorator';
import { FlxModule } from '../../../src/di/flx-module.decorator';
import { ModuleMetadataStorage } from '../../../src/di/module-metadata-storage';
import { DiUnitTest } from '../di-unit-test';


DiUnitTest.configureLogging({
  appenders: [
  ],
  levels: {
    '[all]': 'WARN',
    'ComponentMetadata': 'INFO',
    'ModuleMetadata': 'WARN',
    'ModuleMetadataStorage': 'WARN'
  }
});


import { ConsoleLogger, DateLogger, ILogger, LOGGER } from '../logger';


@FlxComponent({
  providers: [
    { provide: LOGGER, useClass: DateLogger }
  ]
})
class DateLoggerTestComponent {
}


@FlxComponent({
  providers: [
    { provide: LOGGER, useClass: ConsoleLogger }
  ]
})
class ConsoleLoggerTestComponent {
}


@FlxModule({
  declarations: [
    ConsoleLoggerTestComponent
  ],
  providers: [
    ConsoleLoggerTestComponent,
    { provide: LOGGER, useClass: ConsoleLogger }
  ],
  bootstrap: [
    ConsoleLoggerTestComponent
  ]
})
class ConsoleLoggerTestModule {
  constructor(comp: ConsoleLoggerTestComponent, injector: Injector) {
    CoreInjector.instance.setInjector(injector, true);
  }
}



class LoggerTest {
  public logger: ILogger = CoreInjector.instance.getInstance<ILogger>(LOGGER);

  public doLog(message: string) {
    this.logger.log(message);
  }
}



@suite('core.di.CoreInjector')
class CoreInjectorTest extends DiUnitTest {

  @test 'should create ConsoleLogger by token'() {
    const tester = new LoggerTest();
    tester.doLog('hallo');

    expect(tester.logger).to.be.instanceof(ConsoleLogger);
  }

  @test 'should create ConsoleLogger by token from component'() {
    const injector = CoreInjector.instance.resolveAndCreate([ConsoleLoggerTestComponent]);
    const logger = injector.get(LOGGER);
    expect(logger).to.be.instanceof(ConsoleLogger);
  }

  public before() {
    ModuleMetadataStorage.instance.bootstrapModule(ConsoleLoggerTestModule);
  }

}