// tslint:disable:max-classes-per-file
// tslint:disable:member-access
// tslint:disable:no-unused-expression

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';


import { FlxComponent } from '../../../lib/di/flx-component.decorator';
import { FlxModule } from '../../../lib/di/flx-module.decorator';
import { ModuleMetadata } from '../../../lib/di/module-metadata';
import { ModuleMetadataStorage } from '../../../lib/di/module-metadata-storage';

import { DiUnitTest } from '../di-unit-test';


@FlxComponent({
})
export class TestComponent {
}


@FlxModule({
  declarations: [
    TestComponent
  ]
})
export class TestModuleComponent {
}


@suite('core.di.Module: declarations')
class ModuleTest extends DiUnitTest {
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
    this.metadata = ModuleMetadataStorage.instance.findModuleMetadata(TestModuleComponent);
  }
}