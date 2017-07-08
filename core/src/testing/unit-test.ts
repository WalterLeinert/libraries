// tslint:disable:member-access
// tslint:disable:max-classes-per-file

import 'reflect-metadata';

// -------------------------------------- logging --------------------------------------------
import { using } from '../base/disposable';
import { IConfig } from '../diagnostics/config.interface';
import { levels } from '../diagnostics/level';
// tslint:disable-next-line:no-unused-variable
import { ILogger } from '../diagnostics/logger.interface';
import { getLogger } from '../diagnostics/logging-core';
import { configure } from '../diagnostics/logging-core';
import { XLog } from '../diagnostics/xlog';
// -------------------------------------- logging --------------------------------------------


import { CoreInjector } from '../di/core-injector';
import { ConsoleLogger } from '../diagnostics/consoleLogger';
import { DEFAULT_CATEGORY, LOG_EXCEPTIONS, LOGGER } from '../diagnostics/logger.token';
import { SimpleStringifyer } from '../diagnostics/simple-stringifyer';
import { STRINGIFYER } from '../diagnostics/stringifyer.token';


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

    CoreInjector.instance.resolveAndCreate([
      { provide: DEFAULT_CATEGORY, useValue: '-unknown-' },
      { provide: LOGGER, useClass: ConsoleLogger },
      { provide: LOG_EXCEPTIONS, useValue: false },
      { provide: STRINGIFYER, useClass: SimpleStringifyer }   // default
    ]);
  }
}