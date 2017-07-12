// tslint:disable:max-classes-per-file
// tslint:disable:member-access
// tslint:disable:no-unused-expression

import 'reflect-metadata';

import { Injectable, InjectionToken, ReflectiveInjector } from 'injection-js';

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { FlxComponent } from '../../../src/di/flx-component.decorator';
import { FlxModule } from '../../../src/di/flx-module.decorator';
import { ModuleMetadata } from '../../../src/di/module-metadata';
import { ModuleMetadataStorage } from '../../../src/di/module-metadata-storage';
import { CoreUnitTest } from '../../../src/testing/unit-test';


@FlxModule({
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
class ModuleTest extends CoreUnitTest {
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
    expect(this.metadata.bootstrap).to.be.empty;
  }

  protected before() {
    super.before();
    this.metadata = ModuleMetadataStorage.instance.findModuleMetadata(TestModuleEmpty);
  }

  protected static before() {
    // kein bootstrap in Basisklasse
    // ModuleMetadataStorage.instance.bootstrapModule(TestModuleEmpty);
  }
}