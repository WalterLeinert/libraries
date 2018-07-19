// tslint:disable:max-classes-per-file
// tslint:disable:member-access
// tslint:disable:no-unused-expression

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { FlxModule } from '../../../src/di/flx-module.decorator';
import { ModuleMetadata } from '../../../src/di/module-metadata';
import { ModuleMetadataStorage } from '../../../src/di/module-metadata-storage';
import { DiUnitTest } from '../di-unit-test';


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
class ModuleTest extends DiUnitTest {
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
    this.metadata = ModuleMetadataStorage.instance.findModuleMetadata(TestModuleEmpty);
  }
}