// tslint:disable:max-classes-per-file
// tslint:disable:member-access
// tslint:disable:no-unused-expression

import 'reflect-metadata';

import { Injectable, InjectionToken, ReflectiveInjector } from 'injection-js';

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { Component } from '../../../src/di/component.decorator';
import { ModuleMetadata } from '../../../src/di/module-metadata';
import { ModuleMetadataStorage } from '../../../src/di/module-metadata-storage';
import { Module } from '../../../src/di/module.decorator';

import { UnitTest } from '../../../src/testing/unit-test';


class ChildProvider {
}

class ChildChildProvider {
}

class ParentProvider {
}


@Module({
  providers: [
    ChildChildProvider
  ]
})
export class ImportChildChildModule {
}


@Module({
  imports: [
    ImportChildChildModule
  ],
  providers: [
    ChildProvider
  ]
})
export class ImportChildModule {
}


@Module({
  imports: [
    ImportChildModule
  ],
  providers: [
    ParentProvider
  ]
})
export class ImportParentModule {
}



@suite('core.di.Module: module hierarchy and providers')
class ModuleTest extends UnitTest {
  private metadata: ModuleMetadata;

  @test 'should annotate and register modules'() {
    expect(this.metadata).to.be.not.null;
    expect(this.metadata.target).to.equal(ImportParentModule);
  }

  @test 'should have one import (ImportParentModule)'() {
    expect(this.metadata.imports.length).to.equal(1);
    expect(this.metadata.imports[0].target).to.equal(ImportChildModule);
  }


  @test 'should boostrap and create root module instance'() {
    const rootInstance = ModuleMetadataStorage.instance.bootstrapModule(ImportParentModule);
    expect(rootInstance).to.be.instanceof(ImportParentModule);
  }

  @test 'should verify root module instance'() {
    const rootInstance = ModuleMetadataStorage.instance.bootstrapModule(ImportParentModule);
    expect(this.metadata.getInstance<ImportParentModule>(ImportParentModule)).to.equal(rootInstance);
  }

  @test 'should create ImportChildModule instance'() {
    expect(this.metadata.getInstance<ImportChildModule>(ImportChildModule)).to.be.instanceof(ImportChildModule);
  }

  @test 'should create ImportChildChildModule instance'() {
    expect(this.metadata.getInstance<ImportChildModule>(ImportChildChildModule)).to.be.instanceof(
      ImportChildChildModule
    );
  }


  protected before() {
    super.before();
    this.metadata = ModuleMetadataStorage.instance.findModuleMetadata(ImportParentModule);
  }
}