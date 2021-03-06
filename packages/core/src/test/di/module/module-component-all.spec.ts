// tslint:disable:max-classes-per-file
// tslint:disable:member-access
// tslint:disable:no-unused-expression

import 'reflect-metadata';

import { ReflectiveInjector } from 'injection-js';

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { FlxComponent } from '../../../lib/di/flx-component.decorator';
import { FlxModule } from '../../../lib/di/flx-module.decorator';
import { ModuleMetadata } from '../../../lib/di/module-metadata';
import { ModuleMetadataStorage } from '../../../lib/di/module-metadata-storage';

import { DiUnitTest } from '../di-unit-test';


@FlxComponent({
})
export class TestAllComponent {
}

@FlxModule({
})
export class ChildModule {
}

class ProviderClass {
}

@FlxModule({
  imports: [
    ChildModule
  ],
  declarations: [
    TestAllComponent
  ],
  exports: [
    TestAllComponent
  ],
  providers: [
    ProviderClass
  ]
})
export class TestModuleComponentAll {
}


@suite('core.di.Module: imports, declarations, exports, providers')
class ModuleAllTest extends DiUnitTest {
  private metadata: ModuleMetadata;


  @test 'should check imports'() {
    expect(this.metadata.imports.length).to.equal(1);
    expect(this.metadata.imports[0].target).to.equal(ChildModule);
  }

  @test 'should have one declaration'() {
    expect(this.metadata.declarations.length).to.equal(1);
    expect(this.metadata.declarations[0].target).to.equal(TestAllComponent);
  }


  @test 'should check exports'() {
    expect(this.metadata.exports.length).to.equal(1);
    expect(this.metadata.exports[0].target).to.equal(TestAllComponent);
  }

  @test 'should check providers'() {
    expect(this.metadata.providers.length).to.equal(1);
    expect(this.metadata.providers[0]).to.equal(ProviderClass);
  }

  protected before() {
    this.metadata = ModuleMetadataStorage.instance.findModuleMetadata(TestModuleComponentAll);
  }
}