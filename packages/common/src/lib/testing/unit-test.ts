// tslint:disable:member-access
// tslint:disable:max-classes-per-file

import 'reflect-metadata';

import { Injector } from 'injection-js';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { configure, getLogger, IConfig, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

import {
  CoreInjector, DEFAULT_CATEGORY, FlxComponent, FlxModule,
  LOG_EXCEPTIONS, LOGGER, LoggerRegistry, ModuleMetadataStorage, Types
} from '@fluxgate/core';

import { CommonModule } from '../bootstrap';


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


  public static initializeLogging(packageName: string = 'testing', configuration?: IConfig) {

    using(new XLog(CommonUnitTest.logger, levels.DEBUG, 'initializeLogging',
      `packageName = ${packageName}, configuration = ${configuration}`), (log) => {
        if (configuration) {
          LoggerRegistry.configure(configuration);
        }
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