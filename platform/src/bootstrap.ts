// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from './diagnostics';
// -------------------------------------- logging --------------------------------------------


class BootstrapPlatform {
  protected static readonly logger = getLogger(BootstrapPlatform);

  // tslint:disable-next-line:no-unused-variable
  private static initialized = (() => {
    BootstrapPlatform.logger.setLevel(levels.INFO);

    using(new XLog(BootstrapPlatform.logger, levels.INFO, 'initialized'), (log) => {
      log.log(`initializing @fluxgate/platform`);
    });
  })();
}