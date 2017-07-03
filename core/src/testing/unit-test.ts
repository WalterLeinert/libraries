// tslint:disable:member-access
// tslint:disable:max-classes-per-file

import { ReflectiveInjector } from 'injection-js';
import 'reflect-metadata';


// -------------------------------------- logging --------------------------------------------
import { IConfig } from '../diagnostics/config.interface';
// tslint:disable-next-line:no-unused-variable
import { ILogger } from '../diagnostics/logger.interface';
import { configure } from '../diagnostics/logging-core';
// -------------------------------------- logging --------------------------------------------


import { CoreInjector } from '../di/core-injector';
import { ConsoleLogger } from '../diagnostics/consoleLogger';
import { DEFAULT_CATEGORY, LOG_EXCEPTIONS, LOGGER } from '../diagnostics/logger.token';



import { Exception } from '../exceptions/exception';


export abstract class UnitTest {

  config: IConfig = {
    appenders: [
    ],

    levels: {
      '[all]': 'FATAL',
      'Test': 'DEBUG',
      'Test2': 'INFO'
    }
  };

  protected before() {
    configure(this.config);

    const injector = CoreInjector.instance.resolveAndCreate([
      { provide: DEFAULT_CATEGORY, useValue: '-unknown-' },
      { provide: LOGGER, useClass: ConsoleLogger },
      { provide: LOG_EXCEPTIONS, useValue: false }
    ]);
  }

}