// tslint:disable:member-access
// tslint:disable:max-classes-per-file

import 'reflect-metadata';

import { Injectable, InjectionToken, Injector } from 'injection-js';

// -------------------------------------- logging --------------------------------------------
import { using } from '../base/disposable';
import { IConfig } from '../diagnostics/config.interface';
import { levels } from '../diagnostics/level';
// tslint:disable-next-line:no-unused-variable
import { ILogger } from '../diagnostics/logger.interface';
import { getLogger } from '../diagnostics/logging-core';
import { configure } from '../diagnostics/logging-core';
import { XLog } from '../diagnostics/xlog';
// -------------------------------------- logging --------------------------------------------


import { CoreInjector } from '../di/core-injector';
import { FlxModule } from '../di/flx-module.decorator';
import { ModuleMetadataStorage } from '../di/module-metadata-storage';
import { ConsoleLogger } from '../diagnostics/consoleLogger';
import { DEFAULT_CATEGORY, LOG_EXCEPTIONS, LOGGER } from '../diagnostics/logger.token';
import { SimpleStringifyer } from '../diagnostics/simple-stringifyer';
import { STRINGIFYER } from '../diagnostics/stringifyer.token';


/**
 * Standardmodul für Unittests.
 *
 * @class CoreUnitTestModule
 */
@FlxModule({
  providers: [
    { provide: DEFAULT_CATEGORY, useValue: '-unknown-' },
    { provide: LOGGER, useClass: ConsoleLogger },
    { provide: LOG_EXCEPTIONS, useValue: false },
    { provide: STRINGIFYER, useClass: SimpleStringifyer }   // default
  ]
})
export class CoreUnitTestModule {
  constructor(injector: Injector) {
    CoreInjector.instance.setInjector(injector);
  }
}

/**
 * bootstrapping muss bereits hier erfolgen (beim import in ensprechenden Files), damit für die Unittests
 * DI intialisiert ist
 */
(() => {
  ModuleMetadataStorage.instance.bootstrapModule(CoreUnitTestModule);
})();


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
export abstract class UnitTest {

  // tslint:disable-next-line:no-unused-variable
  private static initialized = (() => {
    // const rootInjector = ModuleMetadataStorage.instance.bootstrapModule<CoreUnitTestModule>(CoreUnitTestModule);
  })();


  config: IConfig = {
    appenders: [
    ],

    levels: {
      '[all]': 'FATAL',
      'Test': 'DEBUG',
      'Test2': 'INFO'
    }
  };

  protected before() {
    configure(this.config);
  }
}