import 'reflect-metadata';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

import { EntityStringifyer } from '@fluxgate/common';
import { CoreInjector, DEFAULT_CATEGORY, LOG_EXCEPTIONS, LOGGER, STRINGIFYER } from '@fluxgate/core';


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
        { provide: LOG_EXCEPTIONS, useValue: true },
        { provide: STRINGIFYER, useClass: EntityStringifyer }   // -> resetSecrets
      ]);

      log.log(`registered injector and logger providers`);
    });
  })();
}