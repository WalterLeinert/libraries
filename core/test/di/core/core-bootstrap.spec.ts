// tslint:disable:max-classes-per-file
// tslint:disable:member-access
// tslint:disable:no-unused-expression

import 'reflect-metadata';

import { Injectable, InjectionToken, Injector, ReflectiveInjector } from 'injection-js';

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';


import { FlxComponent } from '../../../src/di/flx-component.decorator';
import { FlxModule } from '../../../src/di/flx-module.decorator';
import { ModuleMetadata } from '../../../src/di/module-metadata';
import { ModuleMetadataStorage } from '../../../src/di/module-metadata-storage';


import { Logger } from './logger.service';


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


@suite('core.di.core: bootstrap')
class CoreTest {


  @test 'should boostrap and create root module instance'() {
    const rootInstance = ModuleMetadataStorage.instance.bootstrapModule<CoreBootstrapModule>(CoreBootstrapModule);
    expect(rootInstance).to.be.instanceof(CoreBootstrapModule);
  }


  @test 'should test injector'() {
    const rootInstance = ModuleMetadataStorage.instance.bootstrapModule<CoreBootstrapModule>(CoreBootstrapModule);

    expect(rootInstance.injector).to.exist;

    expect(rootInstance.injector.get<CoreBootstrapComponent>(CoreBootstrapComponent)).to.be.instanceof(
      CoreBootstrapComponent
    );

    expect(rootInstance.injector.get<Logger>(Logger)).to.be.instanceof(Logger);
  }
}