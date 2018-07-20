// tslint:disable:max-classes-per-file
// tslint:disable:member-access
// tslint:disable:no-unused-expression

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { FlxModule } from '../../../../lib/di/flx-module.decorator';
import { ModuleMetadataStorage } from '../../../../lib/di/module-metadata-storage';

import { DiUnitTest } from '../../di-unit-test';


@FlxModule({
  bootstrap: [
    // fehlt
  ]
})
export class EmptyBootstrapModule {
}


@suite('core.di.core: bootstrap errors (empty bootstrap):')
class Test extends DiUnitTest {

  @test 'should get error'() {
    expect(() => ModuleMetadataStorage.instance.bootstrapModule(EmptyBootstrapModule)).to.Throw(
      `The module EmptyBootstrapModule was bootstrapped, but it does not declare "@FlxModule.bootstrap" ` +
      `components. Please define one.`);
  }
}