import { Assert, Funktion, IException, ServerBusinessException, ServerSystemException, Types } from '@fluxgate/core';

import { ErrorAdapter } from './error-adapter';

export class MysqlErrorAdapter extends ErrorAdapter {

  public createException(err: Error, message?: string): IException {
    // TODO: Test für DB-Fehlerbehandllung
    if (Types.hasProperty(err, 'code') && Types.hasProperty(err, 'sqlMessage')) {
      const code = (err as any).code;
      const sqlMessage = (err as any).sqlMessage;

      let exc: IException;

      switch (code) {
        case 'ER_DUP_ENTRY':
          exc = new ServerBusinessException(sqlMessage);
          break;
      }

      return exc;
    }

    return super.createException(err, message);
  }
}