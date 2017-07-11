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

import { UnitTest } from '../../../src/testing/unit-test';

// tslint:disable-next-line:no-namespace
namespace Di {

  @FlxModule({
  })
  export class TestChildModule {
  }


  @FlxModule({
    imports: [
      TestChildModule,
      // TestModule -> assertion: module already registered
    ],
    providers: [
    ]
  })
  export class TestParentModule {

  }
}


@suite('core.di.Module')
class ModuleTest extends UnitTest {
  private metadata: ModuleMetadata;

  @test 'should annotate and register module'() {
    expect(this.metadata).to.be.not.null;
    expect(this.metadata.target).to.equal(Di.TestParentModule);
  }

  @test 'should have one import'() {
    expect(this.metadata.imports.length).to.equal(1);
    expect(this.metadata.imports[0].target).to.equal(Di.TestChildModule);
  }


  protected before() {
    super.before();
    this.metadata = ModuleMetadataStorage.instance.findModuleMetadata(Di.TestParentModule);
  }
}