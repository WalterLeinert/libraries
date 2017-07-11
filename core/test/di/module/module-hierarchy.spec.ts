// tslint:disable:max-classes-per-file
// tslint:disable:member-access
// tslint:disable:no-unused-expression

import 'reflect-metadata';

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { DiMetadata } from '../../../src/di/di-metadata';
import { FlxComponent } from '../../../src/di/flx-component.decorator';
import { FlxModule } from '../../../src/di/flx-module.decorator';
import { ModuleMetadata } from '../../../src/di/module-metadata';
import { ModuleMetadataStorage } from '../../../src/di/module-metadata-storage';
import { Types } from '../../../src/types/types';

import { UnitTest } from '../../../src/testing/unit-test';


class ChildProvider {
}

class ChildChildProvider {
}

class ParentProvider {
}


@FlxModule({
  providers: [
    ChildChildProvider
  ]
})
export class ImportChildChildModule {
}


@FlxModule({
  imports: [
    ImportChildChildModule
  ],
  providers: [
    ChildProvider
  ]
})
export class ImportChildModule {
}


@FlxModule({
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
    const rootInjector = ModuleMetadataStorage.instance.bootstrapModule(ImportParentModule);
    const name = Types.getClassName(rootInjector);
    expect(name).to.equal(DiMetadata.INJECTOR_CLASSNAME);
  }

  @test 'should verify root module instance'() {
    const rootInjector = ModuleMetadataStorage.instance.bootstrapModule(ImportParentModule);
    expect(this.metadata.injector).to.equal(rootInjector);
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