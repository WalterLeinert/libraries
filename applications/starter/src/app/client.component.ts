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
    { provide: DEFAULT_CATEGORY, useValue: ClientComponent.logger.category },
    { provide: LOGGER, useValue: ClientComponent.logger },
    { provide: LOG_EXCEPTIONS, useValue: true },
    { provide: STRINGIFYER, useClass: EntityStringifyer }
  ]
})
export class ClientComponent {
  protected static readonly logger = getLogger(ClientComponent);

  constructor(injector: Injector) {
    using(new XLog(ClientComponent.logger, levels.INFO, 'ctor'), (log) => {
      CoreInjector.instance.setInjector(injector);
    });
  }
}