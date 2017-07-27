// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

import { Assert, Funktion, IException, ServerSystemException } from '@fluxgate/core';

import { ErrorAdapter } from './error-adapter';
import { MysqlErrorAdapter } from './mysql-error-adapter';

export class ErrorAdapterFactory {
  protected static readonly logger = getLogger(ErrorAdapterFactory);

  public static instance = new ErrorAdapterFactory();

  private constructor() {
  }


  public createAdapter(client: string): ErrorAdapter {
    Assert.notNullOrEmpty(client);

    return using(new XLog(ErrorAdapterFactory.logger, levels.INFO, 'createAdapter', `client = ${client}`), (log) => {
      switch (client) {
        case 'mysql':
          return new MysqlErrorAdapter();

        default:
          log.warn(`No specific adaptor available: taking default adapter`);
          return new ErrorAdapter();
      }
    });
  }
}