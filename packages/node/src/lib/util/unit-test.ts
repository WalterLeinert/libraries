// tslint:disable:member-access
// tslint:disable:max-classes-per-file

import 'reflect-metadata';

import { Injectable, InjectionToken, Injector } from 'injection-js';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import {
  configure, getLogger, IConfig, ILogger, ILoggingConfigurationOptions, levels, using, XLog
} from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

import {
  CoreInjector, DEFAULT_CATEGORY, FlxComponent, FlxModule,
  fromEnvironment, LOG_EXCEPTIONS, LOGGER, ModuleMetadataStorage, Types
} from '@fluxgate/core';

import { NodeModule } from '../bootstrap';
import { Logging } from '../util/logging';


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
    { provide: DEFAULT_CATEGORY, useValue: NodeTestComponent.logger.category },
    { provide: LOGGER, useValue: NodeTestComponent.logger },
    { provide: LOG_EXCEPTIONS, useValue: false }
  ]
})
export class NodeTestComponent {
  public static readonly logger = getLogger(NodeTestComponent);

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
    NodeModule
  ],
  declarations: [
    NodeTestComponent
  ],
  bootstrap: [
    NodeTestComponent
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
 * @class NodeUnitTest
 */
export abstract class NodeUnitTest {

  protected static readonly logger = getLogger(NodeUnitTest);


  /**
   * wird einmal vor allen Tests ausgeführt
   */
  protected static before(done?: (err?: any) => void) {
    using(new XLog(NodeUnitTest.logger, levels.DEBUG, 'static.before'), (log) => {
      ModuleMetadataStorage.instance.bootstrapModule(NodeTestModule);
      done();
    });
  }


  protected static after(done?: (err?: any) => void) {
    // tslint:disable-next-line:no-empty
    using(new XLog(NodeUnitTest.logger, levels.DEBUG, 'static.after'), (log) => {
      done();
    });
  }


  public static initializeLogging(packageName: string = 'testing',
    configurationOptions?: ILoggingConfigurationOptions) {

    using(new XLog(NodeUnitTest.logger, levels.DEBUG, 'initializeLogging',
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
    using(new XLog(NodeUnitTest.logger, levels.DEBUG, 'before'), (log) => {
      NodeUnitTest.initializeLogging();

      done();
    });
  }

  protected after(done?: (err?: any) => void) {
    // tslint:disable-next-line:no-empty
    using(new XLog(NodeUnitTest.logger, levels.DEBUG, 'after'), (log) => {
      done();
    });
  }

}