// tslint:disable:member-access
// tslint:disable:max-classes-per-file

import 'reflect-metadata';

import { Injector } from 'injection-js';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, ILoggingConfigurationOptions, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------


import { AppConfig, CommonModule, EntityStringifyer } from '@fluxgate/common';
import {
  CoreInjector, CoreModule, DEFAULT_CATEGORY, FlxComponent, FlxModule,
  fromEnvironment, LOG_EXCEPTIONS, LOGGER, ModuleMetadataStorage, STRINGIFYER,
  Types
} from '@fluxgate/core';
import { Logging } from '@fluxgate/node';



@FlxComponent({
  providers: [
    { provide: DEFAULT_CATEGORY, useValue: ServerTestComponent.logger.category },
    { provide: LOGGER, useValue: ServerTestComponent.logger },
    { provide: LOG_EXCEPTIONS, useValue: false },
    { provide: STRINGIFYER, useClass: EntityStringifyer }   // -> resetSecrets
  ]
})
export class ServerTestComponent {
  public static readonly logger = getLogger(ServerTestComponent);

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
    ServerTestComponent
  ],
  bootstrap: [
    ServerTestComponent
  ]
})
export class ServerTestModule {
}



/**
 * abstrakte Basisklasse für alle Unittests.
 *
 * Hinweis: die Klasse muss vor allen anderen Testklassen importiert werden, damit die Initialisierung
 * korrekt durchgeführt wird!
 *
 * @export
 * @abstract
 * @class ServerUnitTest
 */
export abstract class ServerUnitTest {

  protected static readonly logger = getLogger(ServerUnitTest);


  /**
   * wird einmal vor allen Tests ausgeführt
   */
  protected static before(done?: (err?: any) => void) {
    using(new XLog(ServerUnitTest.logger, levels.DEBUG, 'static.before'), (log) => {
      ModuleMetadataStorage.instance.bootstrapModule(ServerTestModule);

      process.on('unhandledRejection', (reason) => {
        log.error('unhandledRejection: Reason: ', reason);
      });

      process.on('rejectionHandled', (reason) => {
        log.error('rejectionHandled: Reason: ', reason);
      });

      done();
    });
  }


  protected static after(done?: (err?: any) => void) {
    // tslint:disable-next-line:no-empty
    using(new XLog(ServerUnitTest.logger, levels.DEBUG, 'static.after'), (log) => {
      done();
    });
  }


  public static initializeLogging(packageName: string = 'testing',
    configurationOptions?: ILoggingConfigurationOptions) {

    using(new XLog(ServerUnitTest.logger, levels.DEBUG, 'initializeLogging',
      `packageName = ${packageName}, configuration = ${configurationOptions}`), (log) => {
        if (!Types.isPresent(configurationOptions)) {
          configurationOptions = {
            systemMode: fromEnvironment('NODE_ENV', 'development'),
            relativePath: 'src/test/config'
          };
        }

        Logging.configureLogging(packageName, configurationOptions);
      });
  }


  protected before(done?: (err?: any) => void) {

    // tslint:disable-next-line:no-empty
    using(new XLog(ServerUnitTest.logger, levels.DEBUG, 'before'), (log) => {
      ServerUnitTest.initializeLogging();

      if (AppConfig.config) {
        AppConfig.config.cacheManagerConfiguration = {
          default: {
            cacheType: 'lru'
          },
          configurations: [
            {
              model: '',
              options: {
                maxItems: 1
              }
            }

          ]
        };

      } else {

        //
        // Konfiguration für Tests registrieren
        // hier nur wichtig: cacheManagerConfiguration
        //
        AppConfig.register({
          url: '',
          mode: 'development',
          proxyMode: 'nop',
          cacheManagerConfiguration: {
            default: {
              cacheType: 'lru'
            },
            configurations: [
              {
                model: '',
                options: {
                  maxItems: 1
                }
              }

            ]
          }
        });
      }

      done();
    });
  }

  protected after(done?: (err?: any) => void) {
    // tslint:disable-next-line:no-empty
    using(new XLog(ServerUnitTest.logger, levels.DEBUG, 'after'), (log) => {
      AppConfig.unregister();
      done();
    });
  }

}