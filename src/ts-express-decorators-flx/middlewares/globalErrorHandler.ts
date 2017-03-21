import * as Express from 'express';
import { Err, IMiddlewareError, MiddlewareError, Next, Request, Response } from 'ts-express-decorators';
import { Exception as TsExpressException } from 'ts-httpexceptions';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/common';
// -------------------------------------- logging --------------------------------------------


// fluxgate
import { Exception } from '@fluxgate/common';

@MiddlewareError()
export class GlobalErrorHandler implements IMiddlewareError {
  protected static readonly logger = getLogger(GlobalErrorHandler);


  public use(
    @Err() error: any,
    @Request() request: Express.Request,
    @Response() response: Express.Response,
    @Next() next: Express.NextFunction
  ): any {
    return using(new XLog(GlobalErrorHandler.logger, levels.INFO, 'use'), (log) => {

      if (response.headersSent) {
        return next(error);
      }

      const toHTML = (message = '') => message.replace(/\n/gi, '<br />');

      if (error instanceof Exception) {
        log.error(`Error: ${error}`);
        response.status(500).send(toHTML(error.encodeException()));
        return next();
      }

      if (error instanceof TsExpressException) {
        log.error('' + error);
        response.status(error.status).send(toHTML(error.message));
        return next();
      }

      if (typeof error === 'string') {
        response.status(404).send(toHTML(error));
        return next();
      }

      log.error('' + error);
      response.status(error.status || 500).send('Internal Error');

      return next();
    });
  }
}