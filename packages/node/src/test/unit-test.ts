// tslint:disable:member-access
// tslint:disable:max-classes-per-file

import 'reflect-metadata';

import { Injector } from 'injection-js';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { configure, getLogger, IConfig, ILogger } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

import { DEFAULT_CATEGORY, LOG_EXCEPTIONS, LOGGER } from '@fluxgate/core';
import { CoreInjector, CoreModule, FlxComponent, FlxModule, ModuleMetadataStorage } from '@fluxgate/core';


@FlxComponent({
  providers: [
    { provide: DEFAULT_CATEGORY, useValue: PlatformTestComponent.logger.category },
    { provide: LOGGER, useValue: PlatformTestComponent.logger },
    { provide: LOG_EXCEPTIONS, useValue: false }
  ],
})
export class PlatformTestComponent {
  public static readonly logger = getLogger(PlatformTestComponent);

  constructor(injector: Injector) {
    CoreInjector.instance.setInjector(injector, true);
  }
}

/**
 * Standardmodul für Unittests und abstrakte Basisklasse für alle Unittests.
 *
 * @class CoreUnitTestModule
 */
@FlxModule({
  imports: [
    CoreModule
  ],
  declarations: [
    PlatformTestComponent
  ],
  exports: [
    PlatformTestComponent
  ],
  bootstrap: [
    PlatformTestComponent
  ]
})
export class NodeTestModule {
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
export abstract class NodeUnitTest {

  config: IConfig = {
    appenders: [
    ],

    levels: {
      '[all]': 'WARN',
      'CoreInjector': 'WARN',
      'ComponentMetadata': 'INFO',
      'ModuleMetadata': 'WARN',
      'ModuleMetadataStorage': 'INFO'
    }
  };

  protected before() {
    configure(this.config);
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
    ModuleMetadataStorage.instance.bootstrapModule(NodeTestModule);
  }
}