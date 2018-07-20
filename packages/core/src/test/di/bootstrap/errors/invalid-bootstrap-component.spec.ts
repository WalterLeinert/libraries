// tslint:disable:max-classes-per-file
// tslint:disable:member-access
// tslint:disable:no-unused-expression

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { FlxModule } from '../../../../lib/di/flx-module.decorator';
import { ModuleMetadataStorage } from '../../../../lib/di/module-metadata-storage';

import { DiUnitTest } from '../../di-unit-test';


// decorator fehlt
class Bootstrap {
}


@FlxModule({
  bootstrap: [
    Bootstrap
  ]
})
export class MissingDecoratorModule {
}


@suite('core.di.core: bootstrap errors (invalid bootstrap component):')
class Test extends DiUnitTest {

  @test 'should get error'() {
    expect(() => ModuleMetadataStorage.instance.bootstrapModule(MissingDecoratorModule)).to.Throw(
      'The module MissingDecoratorModule was bootstrapped, but it does not declare "@FlxModule.bootstrap" ' +
      'components. Please define one');
  }
}