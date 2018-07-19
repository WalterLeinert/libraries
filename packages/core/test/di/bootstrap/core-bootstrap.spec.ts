// tslint:disable:max-classes-per-file
// tslint:disable:member-access
// tslint:disable:no-unused-expression

import 'reflect-metadata';

import { InjectionToken, Injector, ReflectiveInjector } from 'injection-js';

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { DiMetadata } from '../../../src/di/di-metadata';
import { FlxComponent } from '../../../src/di/flx-component.decorator';
import { FlxModule } from '../../../src/di/flx-module.decorator';
import { ModuleMetadata } from '../../../src/di/module-metadata';
import { ModuleMetadataStorage } from '../../../src/di/module-metadata-storage';
import { Types } from '../../../src/types/types';

import { DiUnitTest } from '../di-unit-test';
import { Logger } from '../logger.service';


@FlxComponent({
})
export class CoreBootstrapComponent {
  public static injector: Injector;

  constructor(injector: Injector, public logger: Logger) {
    CoreBootstrapComponent.injector = injector;
  }

  public log(message: string) {
    this.logger.log(message);
  }
}


@FlxModule({
  imports: [
  ],
  declarations: [
    CoreBootstrapComponent
  ],
  exports: [
    CoreBootstrapComponent
  ],
  providers: [
    Logger
  ],
  bootstrap: [
    CoreBootstrapComponent
  ]
})
export class CoreBootstrapModule {
  public static injector: Injector;

  constructor(injector: Injector) {
    CoreBootstrapModule.injector = injector;
  }
}


@suite('core.di.core: bootstrap:')
class CoreTest extends DiUnitTest {

  @test 'should bootstrap and create root injector'() {
    expect(CoreBootstrapModule.injector).to.exist;
    expect(Types.getClassName(CoreBootstrapModule.injector)).to.equal(DiMetadata.INJECTOR_CLASSNAME);
  }


  @test 'should test logger creation'() {
    expect(CoreBootstrapModule.injector.get<Logger>(Logger)).to.be.instanceof(Logger);
  }


  @test 'should test component/logger creation by component'() {
    expect(CoreBootstrapComponent.injector.get<CoreBootstrapComponent>(CoreBootstrapComponent)).to.be.instanceof(
      CoreBootstrapComponent
    );

    expect(CoreBootstrapComponent.injector.get<Logger>(Logger)).to.be.instanceof(Logger);
  }

  public before() {
    ModuleMetadataStorage.instance.bootstrapModule(CoreBootstrapModule);
  }
}