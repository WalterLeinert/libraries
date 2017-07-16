// tslint:disable:member-access
// tslint:disable:max-classes-per-file

import 'reflect-metadata';

import { Injector } from 'injection-js';

// -------------------------------------- logging --------------------------------------------
import { IConfig } from '../src/diagnostics/config.interface';
import { configure } from '../src/diagnostics/logging-core';
// -------------------------------------- logging --------------------------------------------

import { CoreInjector } from '../src/di/core-injector';
import { FlxComponent } from '../src/di/flx-component.decorator';
import { FlxModule } from '../src/di/flx-module.decorator';
import { ModuleMetadataStorage } from '../src/di/module-metadata-storage';
import { ConsoleLogger } from '../src/diagnostics/consoleLogger';
import { DEFAULT_CATEGORY, LOG_EXCEPTIONS, LOGGER } from '../src/diagnostics/logger.token';
import { SimpleStringifyer } from '../src/diagnostics/simple-stringifyer';
import { STRINGIFYER } from '../src/diagnostics/stringifyer.token';


@FlxComponent({
})
export class CoreTestComponent {
  constructor(injector: Injector) {
    CoreInjector.instance.setInjector(injector, true);
  }
}


/**
 * Standardmodul für Unittests.
 *
 * @class CoreUnitTestModule
 */
@FlxModule({
  declarations: [
    CoreTestComponent
  ],
  providers: [
    { provide: DEFAULT_CATEGORY, useValue: '-unknown-' },
    { provide: LOGGER, useClass: ConsoleLogger },
    { provide: LOG_EXCEPTIONS, useValue: false },
    { provide: STRINGIFYER, useClass: SimpleStringifyer }   // default
  ],
  bootstrap: [
    CoreTestComponent
  ]
})
export class CoreTestModule {
}


/**
 * abstrakte Basisklasse für alle Unittests.
 *
 * Hinweis: die Klasse muss vor allen anderen Testklassen importiert werden, damit die Initialisierung
 * korrekt durchgeführt wird!
 *
 * @export
 * @abstract
 * @class UnitTest
 */
export abstract class CoreUnitTest {

  protected before() {

    //
    // Default Loggingkonfiguration für jeden Tests
    //
    const config: IConfig = {
      appenders: [
      ],

      levels: {
        '[all]': 'FATAL',
        'Test': 'DEBUG',
        'Test2': 'INFO'
      }
    };

    configure(config);
  }


  protected static before() {

    //
    // Default Loggingkonfiguration für alle Tests
    //
    const config: IConfig = {
      appenders: [
      ],

      levels: {
        '[all]': 'WARN'
      }
    };

    configure(config);
    ModuleMetadataStorage.instance.bootstrapModule(CoreTestModule);
  }
}