import * as Express from 'express';
import { Err, IMiddlewareError, MiddlewareError, Next, Request, Response } from 'ts-express-decorators';
import { Exception as TsExpressException } from 'ts-httpexceptions';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------


// fluxgate
import { Exception, JsonSerializer, Types } from '@fluxgate/core';

@MiddlewareError()
export class GlobalErrorHandler implements IMiddlewareError {
  protected static readonly logger = getLogger(GlobalErrorHandler);

  private static serializer = new JsonSerializer();

  public use(
    @Err() error: any,
    @Request() request: Express.Request,
    @Response() response: Express.Response,
    @Next() next: Express.NextFunction
  ): any {
    return using(new XLog(GlobalErrorHandler.logger, levels.INFO, 'use'), (log) => {

      if (response.headersSent) {
        log.error(`headersSent: ${error}`);
        return next(error);
      }

      const toHTML = (message = '') => message.replace(/\n/gi, '<br />');

      if (error instanceof Exception) {
        log.error(`Exception: ${error}`);

        const serializedError = GlobalErrorHandler.serializer.serialize(error);

        response.status(500).send(serializedError);
        return next();
      }

      if (error instanceof TsExpressException) {
        log.error(`TsExpressException: ${error}`);
        response.status(error.status).send(toHTML(error.message));
        return next();
      }

      if (Types.isString(error)) {
        log.error(`string: ${error}`);
        response.status(404).send(toHTML(error));
        return next();
      }

      log.error(`default: ${error}`);
      response.status(error.status || 500).send('Internal Error');
      return next();
    });
  }
}