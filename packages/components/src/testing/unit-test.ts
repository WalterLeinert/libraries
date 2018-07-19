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
 * Hilfsmodul zur Testinitialisierung
 */
@NgModule({
  providers: [
    TestHelperModule
  ]
})
export class TestHelperModule {

  /**
   * Bei der Instantiierung wird der Injector bereitgestellt
   *
   * @param injector
   */
  constructor(private injector: Injector) {
  }


  /**
   * Testinitialisierung
   *
   * @param config - optionale Logging-Konfiguration
   * @param testModule - optional: Test-Modul für die Initialisierung der DI für @fluxgate/components
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
          '[all]': 'WARN'
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