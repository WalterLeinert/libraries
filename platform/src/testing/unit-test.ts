// tslint:disable:member-access
// tslint:disable:max-classes-per-file

import 'reflect-metadata';

import { Injectable, InjectionToken, Injector } from 'injection-js';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { configure, getLogger, IConfig, ILogger, levels, using, XLog } from '../diagnostics';
// -------------------------------------- logging --------------------------------------------

import { DEFAULT_CATEGORY, LOG_EXCEPTIONS, LOGGER, STRINGIFYER } from '@fluxgate/core';
import { CoreInjector, CoreModule, FlxModule, ModuleMetadataStorage } from '@fluxgate/core';

// Logging-Konfiguration bevor Tests laufen
const config: IConfig = {
  appenders: [
  ],

  levels: {
    '[all]': 'WARN',
    'CoreInjector': 'INFO',
    'ComponentMetadata': 'INFO',
    'ModuleMetadata': 'WARN',
    'ModuleMetadataStorage': 'INFO'
  }
};
configure(config);



/**
 * Standardmodul für Unittests und abstrakte Basisklasse für alle Unittests.
 *
 * @class CoreUnitTestModule
 */
@FlxModule({
  imports: [
    CoreModule
  ],
  providers: [
    { provide: DEFAULT_CATEGORY, useValue: 'PlatformUnitTestModule' },
    { provide: LOGGER, useValue: PlatformUnitTestModule.logger },
    { provide: LOG_EXCEPTIONS, useValue: true },
  ]
})
export class PlatformUnitTestModule {
  public static readonly logger = getLogger(PlatformUnitTestModule);

  constructor(injector: Injector) {
    CoreInjector.instance.setInjector(injector, true);
  }

}


/**
 * bootstrapping muss bereits hier erfolgen (beim import in ensprechenden Files), damit für die Unittests
 * DI intialisiert ist
 */
const init = (() => {
  ModuleMetadataStorage.instance.bootstrapModule(PlatformUnitTestModule);
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
export abstract class PlatformUnitTest {

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