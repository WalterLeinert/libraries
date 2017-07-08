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
import { ModuleMetadata } from '../../src/di/module-metadata';
import { ModuleMetadataStorage } from '../../src/di/module-metadata-storage';
import { Module } from '../../src/di/module.decorator';

import { UnitTest } from '../../src/testing/unit-test';


@Module({
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
  private metadata: ModuleMetadata;

  @test 'should annotate and register module'() {
    expect(this.metadata).to.be.not.null;
    expect(this.metadata.name).to.equal(CoreModule.name);
  }

  @test 'should have one import'() {
    expect(this.metadata.imports.length).to.equal(1);
    expect(this.metadata.imports[0].name).to.equal(TestModule.name);
  }


  protected before() {
    super.before();
    this.metadata = ModuleMetadataStorage.instance.findModuleMetadata(CoreModule);
  }
}