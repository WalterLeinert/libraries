import 'reflect-metadata';

import { Injectable, Injector } from 'injection-js';


// -------------------------------------- logging --------------------------------------------
import { using } from './base/disposable';
import { levels } from './diagnostics/level';
// tslint:disable-next-line:no-unused-variable
import { ILogger } from './diagnostics/logger.interface';
import { getLogger } from './diagnostics/logging-core';
import { XLog } from './diagnostics/xlog';
// -------------------------------------- logging --------------------------------------------

import { CoreInjector } from './di/core-injector';
import { FlxModule } from './di/flx-module.decorator';
import { DEFAULT_CATEGORY, LOG_EXCEPTIONS, LOGGER } from './diagnostics/logger.token';
import { SimpleStringifyer } from './diagnostics/simple-stringifyer';
import { STRINGIFYER } from './diagnostics/stringifyer.token';


@Injectable()
@FlxModule({
  providers: [
    { provide: DEFAULT_CATEGORY, useValue: CoreModule.logger.category },
    { provide: LOGGER, useValue: CoreModule.logger },
    { provide: LOG_EXCEPTIONS, useValue: true },
    { provide: STRINGIFYER, useClass: SimpleStringifyer }   // default
  ]
})
export class CoreModule {
  protected static readonly logger = getLogger(CoreModule);

  // tslint:disable-next-line:no-unused-variable
  private static initialized = (() => {
    CoreModule.logger.setLevel(levels.INFO);
  })();


  constructor(injector: Injector) {
    using(new XLog(CoreModule.logger, levels.INFO, 'ctor'), (log) => {
      log.log(`initializing @fluxgate/core, setting injector`);
      CoreInjector.instance.setInjector(injector);
    });
  }

}