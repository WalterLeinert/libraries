// tslint:disable:member-access
// tslint:disable:max-classes-per-file

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

// -------------------------------------- logging --------------------------------------------
import { using } from '../base/disposable';
import { IConfig } from '../diagnostics/config.interface';
import { levels } from '../diagnostics/level';
// tslint:disable-next-line:no-unused-variable
import { ILogger } from '../diagnostics/logger.interface';
import { configure, getLogger } from '../diagnostics/logging-core';
import { XLog } from '../diagnostics/xlog';
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