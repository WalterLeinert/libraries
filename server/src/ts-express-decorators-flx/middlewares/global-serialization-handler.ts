import * as Express from 'express';
import {
  Endpoint, EndpointInfo, IMiddleware, Middleware, Request, Response, ResponseData
} from 'ts-express-decorators';


// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

import { ServerSystemException } from '@fluxgate/core';

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
        log.info(`request.body = ${JSON.stringify(request.body)}`);
      }
    });

  }
}


// tslint:disable-next-line:max-classes-per-file
@Middleware()
export class GlobalSerializationResponsetHandler implements IMiddleware {
  protected static readonly logger = getLogger(GlobalSerializationResponsetHandler);

  constructor(private metadataService: MetadataService) {
  }

  public use( @ResponseData() data: any, @Response() response: Express.Response) {
    return using(new XLog(GlobalSerializationResponsetHandler.logger, levels.INFO, 'use'), (log) => {

      if (response.headersSent) {
        return;
      }

      const type = typeof data;

      log.info(`data = ${JSON.stringify(data)}`);


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

  public useXX(
    @ResponseData() data: any, // handle the response data sent by the previous middleware
    @EndpointInfo() endpoint: Endpoint,
    @Response() response: Express.Response
  ): any {
    return using(new XLog(GlobalSerializationResponsetHandler.logger, levels.INFO, 'use'), (log) => {

      return new Promise((resolve, reject) => {
        if (response) {
          log.info(`response.status = ${JSON.stringify(response.status)}`);
        }


        // prevent error when response is already sent
        if (response.headersSent) {
          return;
        }


        // const { viewPath, viewOptions } = undefined;    // endpoint.getMetadata(ResponseViewMiddleware);
        const viewOptions = undefined;
        const viewPath = undefined;

        if (viewPath !== undefined) {

          if (viewOptions !== undefined) {
            data = Object.assign({}, data, viewOptions);
          }

          response.render(viewPath, data, (err, html) => {

            if (err) {
              reject(new ServerSystemException(`Error on your template => ${err}`));

            } else {
              resolve(html);
            }

          });
        } else {
          resolve();
        }
      });
    });

  }
}