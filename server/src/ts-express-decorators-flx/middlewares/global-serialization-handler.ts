import * as Express from 'express';
import { IMiddleware, Middleware, Next, Request, Response } from 'ts-express-decorators';


// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

import { MetadataService } from '../services/metadata.service';

@Middleware()
export class GlobalSerializationHandler implements IMiddleware {
  protected static readonly logger = getLogger(GlobalSerializationHandler);

  constructor(private metadataService: MetadataService) {

  }

  public use(
    @Request() request,
    @Response() response: Express.Response,
    @Next() next: Express.NextFunction
  ): any {
    return using(new XLog(GlobalSerializationHandler.logger, levels.INFO, 'use'), (log) => {
      if (request) {
        log.info(`request.body = ${JSON.stringify(request.body)}`);
      }

      if (response) {
        log.info(`response.status = ${JSON.stringify(response.status)}`);
      }

      return next();
    });

  }
}