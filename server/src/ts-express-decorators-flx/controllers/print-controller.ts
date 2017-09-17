import { Authenticated, Controller, Get, Metadata, Post, Request } from 'ts-express-decorators';

// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

// Fluxgate
import { FindResult, IPrinter, IPrintTask } from '@fluxgate/common';

import { PrintService } from '../services/print/print.service';
import { IBodyRequest } from '../session/body-request.interface';
import { ISessionRequest } from '../session/session-request.interface';
import { ControllerCore } from './base/controller-core';
import { FindMethod } from './decorator/find-method.decorator';


@Controller('/printer')
export class PrintController extends ControllerCore {
  protected static readonly logger = getLogger(PrintController);

  constructor(service: PrintService) {
    super(service);
  }

  @Authenticated()
  @Get('/find')
  public getPrinters(
    @Request() request: ISessionRequest
    ): Promise<IPrinter[]> {
    return using(new XLog(PrintController.logger, levels.INFO, 'getPrinters'), (log) => {
      return new Promise<IPrinter[]>((resolve, reject) => {
        this.getService().getPrinters(request).then((result) => {
          resolve(this.serialize(result));
        });
      });
    });
  }



  @Authenticated()
  @Post('/formatData')
  public formatData(
    request: IBodyRequest<IPrintTask>
    ): Promise<any> {
    return Promise.resolve()
      .then(() => this.deserialize<IPrintTask>(request.body))
      .then((deserializedData) => this.getService().formatData(request, deserializedData, 'filename.pdf'))
      .then<any>((result) => this.serialize(result));
  }


  protected getService(): PrintService {
    return super.getService() as PrintService;
  }

}