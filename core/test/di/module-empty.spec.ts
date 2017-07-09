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
  imports: [
  ],
  declarations: [
  ],
  exports: [
  ],
  providers: [
  ]
})
export class TestModuleEmpty {
}


@suite('core.di.Module: no imports, declarations, etc.')
class ModuleTest extends UnitTest {
  private metadata: ModuleMetadata;

  @test 'should annotate and register module'() {
    expect(this.metadata).to.be.not.null;
    expect(this.metadata.target).to.equal(TestModuleEmpty);
  }


  @test 'should check imports'() {
    expect(this.metadata.imports).to.exist;
    expect(this.metadata.imports.length).to.equal(0);
  }

  @test 'should check declarations'() {
    expect(this.metadata.declarations).to.exist;
    expect(this.metadata.declarations.length).to.equal(0);
  }

  @test 'should check exports'() {
    expect(this.metadata.exports).to.exist;
    expect(this.metadata.exports.length).to.equal(0);
  }

  @test 'should check providers'() {
    expect(this.metadata.providers).to.exist;
    expect(this.metadata.providers.length).to.equal(0);
  }

  @test 'should check bootstrap'() {
    expect(this.metadata.bootstrap).to.not.exist;
  }

  protected before() {
    super.before();
    this.metadata = ModuleMetadataStorage.instance.findModuleMetadata(TestModuleEmpty);
  }
}