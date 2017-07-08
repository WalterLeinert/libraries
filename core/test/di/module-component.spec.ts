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


@Component({
})
export class TestComponent {
}


@Module({
  declarations: [
    TestComponent
  ]
})
export class TestModuleComponent {
}


@suite('core.di.Module: declarations')
class ModuleTest extends UnitTest {
  private metadata: ModuleMetadata;

  @test 'should have one declaration'() {
    expect(this.metadata.declarations.length).to.equal(1);
    expect(this.metadata.declarations[0].target).to.equal(TestComponent);
  }


  @test 'should check imports'() {
    expect(this.metadata.imports).to.exist;
    expect(this.metadata.imports.length).to.equal(0);
  }

  @test 'should check exports'() {
    expect(this.metadata.exports).to.exist;
    expect(this.metadata.exports.length).to.equal(0);
  }

  @test 'should check providers'() {
    expect(this.metadata.providers).to.exist;
    expect(this.metadata.providers.length).to.equal(0);
  }

  protected before() {
    super.before();
    this.metadata = ModuleMetadataStorage.instance.findModuleMetadata(TestModuleComponent);
  }
}