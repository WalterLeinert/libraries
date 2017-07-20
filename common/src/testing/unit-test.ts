// tslint:disable:member-access
// tslint:disable:max-classes-per-file

import 'reflect-metadata';

import { Injectable, InjectionToken, Injector } from 'injection-js';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { configure, getLogger, IConfig, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

import {
  CoreInjector, CoreModule, DEFAULT_CATEGORY, FlxComponent, FlxModule,
  fromEnvironment, LOG_EXCEPTIONS, LOGGER, ModuleMetadataStorage, Types
} from '@fluxgate/core';
import { PlatformModule } from '@fluxgate/platform';

import { AppConfig } from '../base/appConfig';
import { CommonComponent, CommonModule } from '../bootstrap';
import { Logging } from '../util/logging';
import { ILoggingConfigurationOptions } from '../util/loggingConfiguration';



// Logging-Konfiguration bevor Tests laufen
const config: IConfig = {
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
configure(config);



@FlxComponent({
  providers: [
    { provide: DEFAULT_CATEGORY, useValue: CommonTestComponent.logger.category },
    { provide: LOGGER, useValue: CommonTestComponent.logger },
    { provide: LOG_EXCEPTIONS, useValue: false }
  ]
})
export class CommonTestComponent {
  public static readonly logger = getLogger(CommonTestComponent);

  constructor(injector: Injector) {
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
    CommonModule
  ],
  declarations: [
    CommonTestComponent
  ],
  bootstrap: [
    CommonTestComponent
  ]
})
export class CommonTestModule {
}



/**
 * abstrakte Basisklasse für alle Unittests.
 *
 * Hinweis: die Klasse muss vor allen anderen Testklassen importiert werden, damit die Initialisierung
 * korrekt durchgeführt wird!
 *
 * @export
 * @abstract
 * @class CommonUnitTest
 */
export abstract class CommonUnitTest {

  protected static readonly logger = getLogger(CommonUnitTest);


  /**
   * wird einmal vor allen Tests ausgeführt
   */
  protected static before(done?: (err?: any) => void) {
    using(new XLog(CommonUnitTest.logger, levels.DEBUG, 'static.before'), (log) => {
      ModuleMetadataStorage.instance.bootstrapModule(CommonTestModule);
      done();
    });
  }


  protected static after(done?: (err?: any) => void) {
    // tslint:disable-next-line:no-empty
    using(new XLog(CommonUnitTest.logger, levels.DEBUG, 'static.after'), (log) => {
      done();
    });
  }


  public static initializeLogging(packageName: string = 'testing',
    configurationOptions?: ILoggingConfigurationOptions) {

    using(new XLog(CommonUnitTest.logger, levels.DEBUG, 'initializeLogging',
      `packageName = ${packageName}, configuration = ${configurationOptions}`), (log) => {
        if (!Types.isPresent(configurationOptions)) {
          configurationOptions = {
            systemMode: fromEnvironment('NODE_ENV', 'development'),
            relativePath: 'test/config'
          };
        }

        Logging.configureLogging(packageName, configurationOptions);
      });
  }


  protected before(done?: (err?: any) => void) {

    // tslint:disable-next-line:no-empty
    using(new XLog(CommonUnitTest.logger, levels.DEBUG, 'before'), (log) => {
      CommonUnitTest.initializeLogging();

      done();
    });
  }

  protected after(done?: (err?: any) => void) {
    // tslint:disable-next-line:no-empty
    using(new XLog(CommonUnitTest.logger, levels.DEBUG, 'after'), (log) => {
      done();
    });
  }

}