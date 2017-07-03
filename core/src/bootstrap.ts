import 'reflect-metadata';

import { ReflectiveInjector } from 'injection-js';

// -------------------------------------- logging --------------------------------------------
import { using } from './base/disposable';
import { levels } from './diagnostics/level';
// tslint:disable-next-line:no-unused-variable
import { ILogger } from './diagnostics/logger.interface';
import { getLogger } from './diagnostics/logging-core';
import { XLog } from './diagnostics/xlog';
// -------------------------------------- logging --------------------------------------------

import { CoreInjector } from './di/core-injector';
import { DEFAULT_CATEGORY, LOGGER } from './diagnostics/logger.token';


class BootstrapCore {
  protected static readonly logger = getLogger(BootstrapCore);

  // tslint:disable-next-line:no-unused-variable
  private static initialized = (() => {
    using(new XLog(BootstrapCore.logger, levels.INFO, 'initialized'), (log) => {
      log.log(`initializing @fluxgate/core`);

      /**
       * logger für DI registrieren
       */
      CoreInjector.instance.resolveAndCreate([
        { provide: DEFAULT_CATEGORY, useValue: BootstrapCore.logger.category },
        { provide: LOGGER, useValue: BootstrapCore.logger }
      ]);

      log.log(`registered injector and logger providers`);
    });
  })();
}