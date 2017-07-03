// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------


export class BootstrapComponents {
  protected static readonly logger = getLogger(BootstrapComponents);

  // tslint:disable-next-line:no-unused-variable
  private static initialized = (() => {
    BootstrapComponents.logger.setLevel(levels.INFO);

    using(new XLog(BootstrapComponents.logger, levels.INFO, 'initialized'), (log) => {
      log.log(`initializing @fluxgate/components`);
    });
  })();
}