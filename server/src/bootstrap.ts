import 'reflect-metadata';

import { ReflectiveInjector } from 'injection-js';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

import { CoreInjector, DEFAULT_CATEGORY, LOG_EXCEPTIONS, LOGGER } from '@fluxgate/core';


class BootstrapServer {
  protected static readonly logger = getLogger(BootstrapServer);

  // tslint:disable-next-line:no-unused-variable
  private static initialized = (() => {
    BootstrapServer.logger.setLevel(levels.INFO);

    using(new XLog(BootstrapServer.logger, levels.INFO, 'initialized'), (log) => {
      log.log(`initializing @fluxgate/server`);

      /**
       * logger für DI registrieren
       */

      CoreInjector.instance.resolveAndCreate([
        { provide: DEFAULT_CATEGORY, useValue: BootstrapServer.logger.category },
        { provide: LOGGER, useValue: BootstrapServer.logger },
        { provide: LOG_EXCEPTIONS, useValue: true }
      ]);

      log.log(`registered injector and logger providers`);
    });
  })();
}