// tslint:disable:max-classes-per-file

import { Injector } from 'injection-js';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------


import { CommonModule } from '@fluxgate/common';
import { CoreInjector, CoreModule, DEFAULT_CATEGORY, FlxComponent, FlxModule, LOGGER } from '@fluxgate/core';
import { PlatformModule } from '@fluxgate/platform';


@FlxComponent({
  providers: [
    { provide: DEFAULT_CATEGORY, useValue: ServerComponent.logger.category },
    { provide: LOGGER, useValue: ServerComponent.logger }
  ],
})
export class ServerComponent {
  public static readonly logger = getLogger(ServerComponent);

  constructor(injector: Injector) {
    using(new XLog(ServerComponent.logger, levels.INFO, 'ctor'), (log) => {
      log.log(`initializing @fluxgate/server, setting injector`);
      CoreInjector.instance.setInjector(injector);
    });
  }
}


@FlxModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ServerComponent
  ],
  exports: [
    ServerComponent
  ],
  bootstrap: [
    ServerComponent
  ]
})
export class ServerModule {
}