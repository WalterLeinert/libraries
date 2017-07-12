// tslint:disable:member-access
// tslint:disable:max-classes-per-file

import 'reflect-metadata';

import { Injector } from 'injection-js';

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
export class CoreTestModule {
  constructor(injector: Injector) {
    CoreInjector.instance.setInjector(injector);
  }
}

/**
 * bootstrapping muss bereits hier erfolgen (beim import in ensprechenden Files), damit für die Unittests
 * DI intialisiert ist
 */
(() => {
  ModuleMetadataStorage.instance.bootstrapModule(CoreTestModule);
})();