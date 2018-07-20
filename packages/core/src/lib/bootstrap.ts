// tslint:disable:max-classes-per-file

import 'reflect-metadata';

import { Injector } from 'injection-js';


// -------------------------------------- logging --------------------------------------------
import { using } from './base/disposable';
import { levels } from './diagnostics/level';
// tslint:disable-next-line:no-unused-variable
import { ILogger } from './diagnostics/logger.interface';
import { getLogger } from './diagnostics/logging-core';
import { XLog } from './diagnostics/xlog';
// -------------------------------------- logging --------------------------------------------

import { CoreInjector } from './di/core-injector';
import { FlxComponent } from './di/flx-component.decorator';
import { FlxModule } from './di/flx-module.decorator';
import { DEFAULT_CATEGORY, LOG_EXCEPTIONS, LOGGER } from './diagnostics/logger.token';
import { SimpleStringifyer } from './diagnostics/simple-stringifyer';
import { STRINGIFYER } from './diagnostics/stringifyer.token';


@FlxComponent({
  providers: [
    { provide: DEFAULT_CATEGORY, useValue: CoreComponent.logger.category },
    { provide: LOGGER, useValue: CoreComponent.logger },
    { provide: LOG_EXCEPTIONS, useValue: true },
    { provide: STRINGIFYER, useClass: SimpleStringifyer }   // default
  ]
})
export class CoreComponent {
  public static readonly logger = getLogger(CoreComponent);

  constructor(injector: Injector) {
    using(new XLog(CoreComponent.logger, levels.INFO, 'ctor'), (log) => {
      log.log(`initializing @fluxgate/core, setting injector`);
      CoreInjector.instance.setInjector(injector);
    });
  }
}

@FlxModule({
  declarations: [
    CoreComponent
  ],
  exports: [
    CoreComponent
  ],
  bootstrap: [
    CoreComponent
  ]
})
export class CoreModule {
}