// tslint:disable:max-classes-per-file

import { Injector } from 'injection-js';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------


import { ClientModule } from '@fluxgate/client';
import { CoreInjector, CoreModule, DEFAULT_CATEGORY, FlxComponent, FlxModule, LOGGER } from '@fluxgate/core';
import { PlatformModule } from '@fluxgate/platform';


@FlxComponent({
  providers: [
    { provide: DEFAULT_CATEGORY, useValue: ComponentsComponent.logger.category },
    { provide: LOGGER, useValue: ComponentsComponent.logger }
  ],
})
export class ComponentsComponent {
  public static readonly logger = getLogger(ComponentsComponent);

  constructor(injector: Injector) {
    using(new XLog(ComponentsComponent.logger, levels.INFO, 'ctor'), (log) => {
      log.log(`initializing @fluxgate/components, setting injector`);
      CoreInjector.instance.setInjector(injector);
    });
  }
}


@FlxModule({
  imports: [
    ClientModule
  ],
  declarations: [
    ComponentsComponent
  ],
  exports: [
    ComponentsComponent
  ],
  bootstrap: [
    ComponentsComponent
  ]
})
export class ComponentsModule {
}