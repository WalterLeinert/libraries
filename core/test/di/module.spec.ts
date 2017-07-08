// tslint:disable:max-classes-per-file
// tslint:disable:member-access
// tslint:disable:no-unused-expression

import 'reflect-metadata';

import { Injectable, InjectionToken, ReflectiveInjector } from 'injection-js';

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { CoreInjector } from '../../src/di/core-injector';
import { ConsoleLogger } from '../../src/diagnostics/consoleLogger';
import { DEFAULT_CATEGORY, LOG_EXCEPTIONS, LOGGER } from '../../src/diagnostics/logger.token';
import { SimpleStringifyer } from '../../src/diagnostics/simple-stringifyer';
import { STRINGIFYER } from '../../src/diagnostics/stringifyer.token';



import { Component } from '../../src/di/component.decorator';
import { ModuleMetadataStorage } from '../../src/di/module-metadata-storage';
import { Module } from '../../src/di/module.decorator';

import { UnitTest } from '../../src/testing/unit-test';

const init = (() => {
  CoreInjector.instance.resolveAndCreate([
    { provide: DEFAULT_CATEGORY, useValue: 'test' },
    { provide: LOGGER, useClass: ConsoleLogger },
    { provide: LOG_EXCEPTIONS, useValue: true },
    { provide: STRINGIFYER, useClass: SimpleStringifyer }
  ]);
});


class NoModule {
}

class NoComponent {
}



@Component({
})
export class TestComponent {

}


@Module({
  imports: [
    // NoModule -> assertion: no module
  ],
  declarations: [
    // NoComponent, -> assertion: declarations: component NoComponent not registered
    TestComponent
  ],
  exports: [
    TestComponent
  ],
  providers: [
  ]
})
export class TestModule {
}


@Module({
  imports: [
    TestModule,
    // TestModule -> assertion: module already registered
  ],
  providers: [
  ]
})
export class CoreModule {

}


@suite('core.di.Module')
class ModuleTest extends UnitTest {

  @test 'should annotate and register module'() {
    const metadata = ModuleMetadataStorage.instance.findModuleMetadata(CoreModule);

    expect(metadata).to.be.not.null;
    expect(metadata.name).to.equal(CoreModule.name);
  }
}