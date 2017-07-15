// tslint:disable:max-classes-per-file
// tslint:disable:member-access
// tslint:disable:no-unused-expression
// tslint:disable:class-name

import 'reflect-metadata';

import { Injectable, Injector } from 'injection-js';

import { expect } from 'chai';
import { only, suite, test } from 'mocha-typescript';

import { DiMetadata } from '../../../src/di/di-metadata';
import { FlxComponent } from '../../../src/di/flx-component.decorator';
import { FlxModule } from '../../../src/di/flx-module.decorator';
import { ModuleMetadata } from '../../../src/di/module-metadata';
import { ModuleMetadataStorage } from '../../../src/di/module-metadata-storage';
import { IConfig } from '../../../src/diagnostics/config.interface';
import { configure } from '../../../src/diagnostics/logging-core';
import { Types } from '../../../src/types/types';

import { CoreUnitTest } from '../../unit-test';



// ------------------------ Module_0 ---------------------------------------------
@Injectable()
export class Service_0 {
}

@FlxModule({
  providers: [
    Service_0
  ]
})
export class Module_0 {
}
// ------------------------ Module_0 ---------------------------------------------

// ------------------------ Module_1 ---------------------------------------------
@Injectable()
export class Service_1 {
}

@FlxModule({
  imports: [
    Module_0
  ],
  providers: [
    Service_1
  ]
})
export class Module_1 {
}
// ------------------------ Module_1 ---------------------------------------------


// ------------------------ Module_2 ---------------------------------------------
@Injectable()
export class Service_2 {
}

@FlxComponent({
})
export class Component_2 {
  public static injector: Injector;

  constructor(injector: Injector) {
    Component_2.injector = injector;
  }
}

@FlxModule({
  imports: [
    Module_1
  ],
  declarations: [
    Component_2
  ],
  providers: [
    Service_2
  ],
  bootstrap: [
    Component_2
  ]
})
export class Module_2 {
  public static injector: Injector;

  constructor(injector: Injector) {
    Module_2.injector = injector;
  }
}
// ------------------------ Module_2 ---------------------------------------------



@suite('core.di: providers and module hierarchy') @only
class ModuleTest extends CoreUnitTest {
  private metadata: ModuleMetadata;

  @test 'should annotate and register modules'() {
    expect(this.metadata).to.be.not.null;
    expect(this.metadata.target).to.equal(Module_2);
  }

  // @test 'should get Component_3_1 by Module_3'() {
  //   expect(Module_3.injector.get(Component_3_1)).to.exist;
  // }

  @test 'should get Service_2 by Module_2'() {
    expect(Module_2.injector.get(Service_2)).to.exist;
  }

  @test 'should get Service_1 by Module_2'() {
    expect(Module_2.injector.get(Service_1)).to.exist;
  }

  @test 'should get Service_0 by Module_2'() {
    expect(Module_2.injector.get(Service_0)).to.exist;
  }



  protected before() {
    super.before();
    this.metadata = ModuleMetadataStorage.instance.findModuleMetadata(Module_2);
  }

  protected static before() {
    // kein bootstrap in Basisklasse

    //
    // Default Loggingkonfiguration für jeden Tests
    //
    const config: IConfig = {
      appenders: [
      ],

      levels: {
        '[all]': 'ERROR',
        'ModuleMetadataStorage': 'WARN',
      }
    };

    configure(config);

    ModuleMetadataStorage.instance.bootstrapModule(Module_2);
  }
}