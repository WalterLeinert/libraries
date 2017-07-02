// tslint:disable:member-access
// tslint:disable:max-classes-per-file

import 'reflect-metadata';

// -------------------------------------- logging --------------------------------------------
import { IConfig } from '../diagnostics/config.interface';
// tslint:disable-next-line:no-unused-variable
import { ILogger } from '../diagnostics/logger.interface';
import { configure } from '../diagnostics/logging-core';
// -------------------------------------- logging --------------------------------------------

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

    Exception.logException = false;
  }

}