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


@suite('core.di.Module')
class ModuleTest extends DiUnitTest {
  private metadata: ModuleMetadata;

  @test 'should annotate and register module'() {
    expect(this.metadata).to.be.not.null;
    expect(this.metadata.target).to.equal(TestParentModule);
  }

  @test 'should have one import'() {
    expect(this.metadata.imports.length).to.equal(1);
    expect(this.metadata.imports[0].target).to.equal(TestChildModule);
  }


  protected before() {
    this.metadata = ModuleMetadataStorage.instance.findModuleMetadata(TestParentModule);
  }
}