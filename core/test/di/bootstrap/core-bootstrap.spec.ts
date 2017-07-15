// tslint:disable:max-classes-per-file
// tslint:disable:member-access
// tslint:disable:no-unused-expression

import 'reflect-metadata';

import { Injectable, InjectionToken, Injector, ReflectiveInjector } from 'injection-js';

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { IConfig } from '../../../src/diagnostics/config.interface';
import { configure } from '../../../src/diagnostics/logging-core';

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
  bootstrap: [
    CoreBootstrapComponent
  ]
})
export class CoreBootstrapModule {
  public static injector: Injector;

  constructor(injector: Injector) {
    // tslint:disable-next-line:no-console
    console.log(`injector: ` + injector);

    CoreBootstrapModule.injector = injector;
  }
}


@suite('core.di.core: bootstrap:')
class CoreTest {

  @test 'should bootstrap and create root injector'() {
    expect(CoreBootstrapModule.injector).to.exist;
    expect(Types.getClassName(CoreBootstrapModule.injector)).to.equal(DiMetadata.INJECTOR_CLASSNAME);
  }


  @test 'should test component creation'() {
    expect(CoreBootstrapModule.injector.get<CoreBootstrapComponent>(CoreBootstrapComponent)).to.be.instanceof(
      CoreBootstrapComponent
    );

    expect(CoreBootstrapModule.injector.get<Logger>(Logger)).to.be.instanceof(Logger);
  }

  public before() {
    ModuleMetadataStorage.instance.bootstrapModule(CoreBootstrapModule);
  }

  protected static before() {

    const config: IConfig = {
      appenders: [
      ],

      levels: {
        '[all]': 'ERROR',
        'ModuleMetadataStorage': 'WARN',
      }
    };

    configure(config);
  }
}