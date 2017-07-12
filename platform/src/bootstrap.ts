// tslint:disable:max-classes-per-file

import { Injector } from 'injection-js';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from './diagnostics';
// -------------------------------------- logging --------------------------------------------

import { CoreInjector, CoreModule, DEFAULT_CATEGORY, FlxComponent, FlxModule, LOGGER } from '@fluxgate/core';



@FlxComponent({
  providers: [
    { provide: DEFAULT_CATEGORY, useValue: PlatformComponent.logger.category },
    { provide: LOGGER, useValue: PlatformComponent.logger }
  ],
})
export class PlatformComponent {
  public static readonly logger = getLogger(PlatformComponent);

  constructor(injector: Injector) {
    using(new XLog(PlatformComponent.logger, levels.INFO, 'ctor'), (log) => {
      log.log(`initializing @fluxgate/platform, setting injector`);
      CoreInjector.instance.setInjector(injector);
    });
  }
}



@FlxModule({
  imports: [
    CoreModule
  ],
  declarations: [
    PlatformComponent
  ],
  exports: [
    PlatformComponent
  ],
  bootstrap: [
    PlatformComponent
  ]
})
export class PlatformModule {
}