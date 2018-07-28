// -------------------------------------- logging --------------------------------------------
import { getLogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

import { EntityStringifyer } from '@fluxgate/common';
import {
  CoreInjector, DEFAULT_CATEGORY, FlxComponent, Injector, LOG_EXCEPTIONS,
  LOGGER, STRINGIFYER
} from '@fluxgate/core';


@FlxComponent({
  providers: [
    { provide: DEFAULT_CATEGORY, useValue: ServerComponent.logger.category },
    { provide: LOGGER, useValue: ServerComponent.logger },
    { provide: LOG_EXCEPTIONS, useValue: true },
    { provide: STRINGIFYER, useClass: EntityStringifyer }
  ]
})
export class ServerComponent {
  protected static readonly logger = getLogger(ServerComponent);

  constructor(injector: Injector) {
    using(new XLog(ServerComponent.logger, levels.INFO, 'ctor'), (log) => {
      CoreInjector.instance.setInjector(injector);
    });
  }
}