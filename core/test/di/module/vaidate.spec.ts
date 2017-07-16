// tslint:disable:max-classes-per-file
// tslint:disable:member-access
// tslint:disable:no-unused-expression

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { FlxComponent } from '../../../src/di/flx-component.decorator';
import { FlxModule } from '../../../src/di/flx-module.decorator';
import { ModuleMetadata } from '../../../src/di/module-metadata';
import { ModuleMetadataStorage } from '../../../src/di/module-metadata-storage';
import { DiUnitTest } from '../di-unit-test';


@FlxComponent({
})
export class TestComponent {
}


@FlxModule({
  declarations: [
    TestComponent
  ],
  exports: [
    TestComponent
  ]
})
export class ChildModule {
}


@FlxModule({
  imports: [
    ChildModule
  ],
  exports: [
    TestComponent,
    // TestChildModule
  ],
  bootstrap: [
    TestComponent
  ]
})
export class TestModule {
}


@suite('core.di.Module: validate declarations/exports')
class ValidationTest extends DiUnitTest {

  @test 'should annotate and register module'() {
    ModuleMetadataStorage.instance.bootstrapModule(TestModule);
  }

}