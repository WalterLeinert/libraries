import { Authenticated, Controller, Delete, Get, PathParams, Post, Put, Request } from 'ts-express-decorators';

// Fluxgate
import {
  CreateResult, DeleteResult, FindByIdResult, FindResult, IPrinter, QueryResult,
  Role, UpdateResult
} from '@fluxgate/common';

import { PrintService } from '../services/print.service';
import { ISessionRequest } from '../session/session-request.interface';
import { ControllerCore } from './base/controller-core';


@Controller('/printer')
export class PrinterController extends ControllerCore {


  constructor(service: PrintService) {
    super(service);
  }

  @Authenticated()
  @Get('/')
  public find(
    @Request() request: ISessionRequest
    ): Promise<FindResult<IPrinter>> {
    return this.findInternal(request);
  }

  protected getService(): PrintService {
    return super.getService() as PrintService;
  }


  private findInternal(
    request: ISessionRequest,
  ): Promise<FindResult<IPrinter>> {
    return new Promise<FindResult<IPrinter>>((resolve, reject) => {
      this.getService().find(request).then((result) => {
        resolve(this.serialize(result));
      });
    });
  }

}
