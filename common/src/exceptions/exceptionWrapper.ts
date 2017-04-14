// -------------------------- logging -------------------------------
import { using } from '@fluxgate/core';
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

import { Exception, ExceptionFactory, IException, NotSupportedException, Types } from '@fluxgate/core';


export class ExceptionWrapper {
  protected static readonly logger = getLogger(ExceptionWrapper);


  public static createBusinessException(error: string | IException | Error): IException {
    return ExceptionWrapper.createException('ServerBusinessException', error);
  }

  public static createSystemException(error: string | IException | Error): IException {
    return ExceptionWrapper.createException('ServerSystemException', error);
  }


  public static createException(kind: string, error: string | IException | Error): IException {
    return using(new XLog(ExceptionWrapper.logger, levels.INFO, 'createException'), (log) => {
      let exc: IException;

      if (Types.isString(error)) {
        exc = ExceptionFactory.create(kind, (error as string));
      } else if (error instanceof Error) {
        const err = error as Error;
        exc = ExceptionFactory.create(kind, err.message, err);
      } else if ((error as any) instanceof Exception) {

        // TODO: prüfen, ob das immer so passt?
        exc = error as any as Exception;
      } else {
        throw new NotSupportedException(`error not supported: ${error}`);
      }

      log.log(`exc = ${exc}`);

      return exc;
    });
  }

}