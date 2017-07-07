// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

class BootstrapCommon {
  protected static readonly logger = getLogger(BootstrapCommon);

  // tslint:disable-next-line:no-unused-variable
  private static initialized = (() => {
    BootstrapCommon.logger.setLevel(levels.INFO);

    using(new XLog(BootstrapCommon.logger, levels.INFO, 'initialized'), (log) => {
      log.log(`initializing @fluxgate/common`);
    });
  })();
}