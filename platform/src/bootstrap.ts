

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from './diagnostics';
// -------------------------------------- logging --------------------------------------------

import { CoreInjector, DEFAULT_CATEGORY, LOGGER } from '@fluxgate/core';


class BootstrapPlatform {
  protected static readonly logger = getLogger(BootstrapPlatform);

  // tslint:disable-next-line:no-unused-variable
  private static initialized = (() => {
    using(new XLog(BootstrapPlatform.logger, levels.INFO, 'initialized'), (log) => {
      log.log(`initializing @fluxgate/platform`);
    });
  })();
}