import { Authenticated, Controller, Delete, Get, PathParams, Post, Put, Request } from 'ts-express-decorators';

// Fluxgate
import {
  CreateResult, DeleteResult, FindByIdResult, FindResult, IPrinter, QueryResult,
  Role, UpdateResult
} from '@fluxgate/common';

import { PrintService } from '../services/print.service';
import { ISessionRequest } from '../session/session-request.interface';
import { NanoController } from './base/nano-controller';


@Controller('/printer')
export class PrinterController extends NanoController<IPrinter> {


  constructor(service: PrintService) {
    super(service, 'undefined', 'undefined');
  }


  @Get('/')
  public find(
    @Request() request: ISessionRequest
    ): Promise<FindResult<IPrinter>> {
    return super.findInternal(request);
  }

}
