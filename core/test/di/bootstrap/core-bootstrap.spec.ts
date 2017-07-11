// tslint:disable:max-classes-per-file
// tslint:disable:member-access
// tslint:disable:no-unused-expression

import 'reflect-metadata';

import { Injectable, InjectionToken, Injector, ReflectiveInjector } from 'injection-js';

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';


import { DiMetadata } from '../../../src/di/di-metadata';
import { FlxComponent } from '../../../src/di/flx-component.decorator';
import { FlxModule } from '../../../src/di/flx-module.decorator';
import { ModuleMetadata } from '../../../src/di/module-metadata';
import { ModuleMetadataStorage } from '../../../src/di/module-metadata-storage';
import { Types } from '../../../src/types/types';

import { Logger } from '../logger.service';


@Injectable()
@FlxComponent({
})
export class CoreBootstrapComponent {
  constructor(public logger: Logger) {

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
  bootstrap: CoreBootstrapComponent
})
export class CoreBootstrapModule {
  constructor(public injector: Injector) {
    // tslint:disable-next-line:no-console
    console.log(`injector: ` + injector);

    this.injector = injector;
  }
}


@suite('core.di.core: bootstrap:')
class CoreTest {
  private rootInjector: Injector;


  @test 'should boostrap and create root injector'() {
    expect(this.rootInjector).to.exist;
    expect(Types.getClassName(this.rootInjector)).to.equal(DiMetadata.INJECTOR_CLASSNAME);
  }


  @test 'should test component creation'() {
    expect(this.rootInjector.get<CoreBootstrapComponent>(CoreBootstrapComponent)).to.be.instanceof(
      CoreBootstrapComponent
    );

    expect(this.rootInjector.get<Logger>(Logger)).to.be.instanceof(Logger);
  }

  public before() {
    this.rootInjector = ModuleMetadataStorage.instance.bootstrapModule(CoreBootstrapModule);
  }
}