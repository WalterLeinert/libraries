// tslint:disable:member-access
// tslint:disable:max-classes-per-file

import { Injectable, Injector, NgModule, Optional } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import 'reflect-metadata';

import { Injector as FlxInjector } from 'injection-js';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { configure, getLogger, IConfig, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

import { AppInjector, ClientModule } from '@fluxgate/client';
import { AppConfig, CommonUnitTest, ILoggingConfigurationOptions } from '@fluxgate/common';
import {
  CoreInjector, CoreModule, DEFAULT_CATEGORY, FlxComponent, FlxModule,
  fromEnvironment, Funktion, LOG_EXCEPTIONS, LOGGER, ModuleMetadataStorage, STRINGIFYER,
  Types
} from '@fluxgate/core';
import { PlatformModule } from '@fluxgate/platform';




// Logging-Konfiguration bevor Tests laufen
const staticConfig: IConfig = {
  appenders: [
  ],

  levels: {
    '[all]': 'WARN',
    'CoreInjector': 'WARN',
    'ComponentMetadata': 'INFO',
    'ModuleMetadata': 'WARN',
    'ModuleMetadataStorage': 'WARN'
  }
};
configure(staticConfig);



@FlxComponent({
  providers: [
    { provide: DEFAULT_CATEGORY, useValue: ComponentsTestComponent.logger.category },
    { provide: LOGGER, useValue: ComponentsTestComponent.logger }
  ]
})
export class ComponentsTestComponent {
  public static readonly logger = getLogger(ComponentsTestComponent);

  constructor(injector: FlxInjector) {
    CoreInjector.instance.setInjector(injector, true);
  }
}


/**
 * Standardmodul für Unittests.
 *
 * @class CommonUnitTestModule
 */
@FlxModule({
  imports: [
    ClientModule
  ],
  declarations: [
    ComponentsTestComponent
  ],
  bootstrap: [
    ComponentsTestComponent
  ]
})
export class ComponentsTestModule {
}




/**
 * Hilfsklasse/Service zum Ermitteln eines zentralen Injectors (Root-Injector?)
 */
@Injectable()
export class InjectorHelper {
  constructor(public injector: Injector) {
  }
}


@NgModule({
  providers: [
    InjectorHelper,
    TestHelperModule
  ]
})
export class TestHelperModule {

  constructor(private injector: Injector) {
  }


  /**
   * Testinitialisierung
   *
   * @param config
   * @param testModule
   */
  public static initialize(config?: IConfig, testModule: Funktion = ComponentsTestModule) {

    if (!config) {
      //
      // Default Loggingkonfiguration für jeden Tests
      //
      config = {
        appenders: [
        ],

        levels: {
          '[all]': 'INFO',
          'Test': 'DEBUG',
          'Test2': 'INFO'
        }
      };
    }
    configure(config);

    const testHelper: TestHelperModule = TestBed.get(TestHelperModule);

    // boostrap für das Testmodul
    ModuleMetadataStorage.instance.bootstrapModule(testModule);

    // ... und als globalen Injector setzen
    AppInjector.instance.setInjector(testHelper.injector, true);
  }
}