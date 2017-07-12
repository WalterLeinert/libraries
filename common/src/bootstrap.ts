// tslint:disable:max-classes-per-file

import { Injector } from 'injection-js';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

import { CoreInjector, CoreModule, DEFAULT_CATEGORY, FlxComponent, FlxModule, LOGGER } from '@fluxgate/core';
import { PlatformModule } from '@fluxgate/platform';


@FlxComponent({
  providers: [
    { provide: DEFAULT_CATEGORY, useValue: CommonComponent.logger.category },
    { provide: LOGGER, useValue: CommonComponent.logger }
  ],
})
export class CommonComponent {
  public static readonly logger = getLogger(CommonComponent);

  constructor(injector: Injector) {
    using(new XLog(CommonComponent.logger, levels.INFO, 'ctor'), (log) => {
      log.log(`initializing @fluxgate/common, setting injector`);
      CoreInjector.instance.setInjector(injector);
    });
  }
}


@FlxModule({
  imports: [
    PlatformModule
  ],
  declarations: [
    CommonComponent
  ],
  exports: [
    CommonComponent
  ],
  bootstrap: [
    CommonComponent
  ]
})
export class CommonModule {
}