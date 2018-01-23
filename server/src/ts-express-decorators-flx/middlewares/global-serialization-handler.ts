import * as Express from 'express';
import {
  EndpointInfo, IMiddleware, Middleware, Request, Response, ResponseData
} from 'ts-express-decorators';


// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

import { Core, ServerSystemException } from '@fluxgate/core';

import { MetadataService } from '../services/metadata.service';

@Middleware()
export class GlobalSerializationRequestHandler implements IMiddleware {
  protected static readonly logger = getLogger(GlobalSerializationRequestHandler);

  constructor(private metadataService: MetadataService) {
  }

  public use(
    @Request() request
  ): any {
    return using(new XLog(GlobalSerializationRequestHandler.logger, levels.INFO, 'use'), (log) => {
      if (request) {
        log.info(`request.body = ${Core.stringify(request.body)}`);
      }
    });

  }
}


// tslint:disable-next-line:max-classes-per-file
@Middleware()
export class GlobalSerializationResponseHandler implements IMiddleware {
  protected static readonly logger = getLogger(GlobalSerializationResponseHandler);

  constructor(private metadataService: MetadataService) {
  }

  public use( @ResponseData() data: any, @Response() response: Express.Response) {
    return using(new XLog(GlobalSerializationResponseHandler.logger, levels.INFO, 'use'), (log) => {

      if (response.headersSent) {
        return;
      }

      const type = typeof data;

      log.info(`data = ${Core.stringify(data)}`);


      if (data === undefined) {
        response.send('');
      } else if (data === null || ['number', 'boolean', 'string'].indexOf(type) > -1) {
        response.send(data);
      } else {

        response.setHeader('Content-Type', 'text/json');
        response.json(data);
      }
    });

  }
}