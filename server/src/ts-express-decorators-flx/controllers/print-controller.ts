import {
  Authenticated, Controller, Request
} from 'ts-express-decorators';

// Fluxgate
import {
  FindResult, IPrinter
} from '@fluxgate/common';

import { PrintService } from '../services/print.service';
import { ISessionRequest } from '../session/session-request.interface';
import { ControllerCore } from './base/controller-core';
import { FindMethod } from './decorator/find-method.decorator';

@Controller('/printer')
export class PrinterController extends ControllerCore {

  constructor(service: PrintService) {
    super(service);
  }

  @Authenticated()
  @FindMethod()
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