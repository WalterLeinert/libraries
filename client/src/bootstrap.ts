import 'reflect-metadata';

import { ReflectiveInjector } from 'injection-js';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

import { CoreInjector, DEFAULT_CATEGORY, LOG_EXCEPTIONS, LOGGER } from '@fluxgate/core';


class BootstrapClient {
  protected static readonly logger = getLogger(BootstrapClient);

  // tslint:disable-next-line:no-unused-variable
  private static initialized = (() => {
    BootstrapClient.logger.setLevel(levels.INFO);

    using(new XLog(BootstrapClient.logger, levels.INFO, 'initialized'), (log) => {
      log.log(`initializing @fluxgate/client`);

      /**
       * logger für DI registrieren
       */

      CoreInjector.instance.resolveAndCreate([
        { provide: DEFAULT_CATEGORY, useValue: BootstrapClient.logger.category },
        { provide: LOGGER, useValue: BootstrapClient.logger },
        { provide: LOG_EXCEPTIONS, useValue: true }
      ]);

      log.log(`registered injector and logger providers`);
    });
  })();
}