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
    { provide: DEFAULT_CATEGORY, useValue: TestingComponent.logger.category },
    { provide: LOGGER, useValue: TestingComponent.logger }
  ],
})
export class TestingComponent {
  public static readonly logger = getLogger(TestingComponent);

  constructor(injector: Injector) {
    using(new XLog(TestingComponent.logger, levels.INFO, 'ctor'), (log) => {
      log.log(`initializing @fluxgate/client, setting injector`);
      CoreInjector.instance.setInjector(injector);
    });
  }
}


@FlxModule({
  imports: [
    CommonModule
  ],
  declarations: [
    TestingComponent
  ],
  exports: [
    TestingComponent
  ],
  bootstrap: [
    TestingComponent
  ]
})
export class TestingModule {
}