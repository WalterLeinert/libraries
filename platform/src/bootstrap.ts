import { Injectable, Injector } from 'injection-js';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from './diagnostics';
// -------------------------------------- logging --------------------------------------------

import { CoreInjector, CoreModule, FlxComponent, FlxModule } from '@fluxgate/core';


@Injectable()
@FlxModule({
  imports: [
    CoreModule
  ]
})
export class PlatformModule {
  protected static readonly logger = getLogger(PlatformModule);

  constructor(injector: Injector) {
    PlatformModule.logger.setLevel(levels.INFO);

    using(new XLog(PlatformModule.logger, levels.INFO, 'ctor'), (log) => {
      log.log(`initializing @fluxgate/platform, setting injector`);
      CoreInjector.instance.setInjector(injector);
    });
  }

}