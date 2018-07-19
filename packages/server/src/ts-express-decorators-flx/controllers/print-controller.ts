import { Authenticated, Controller, Get, Metadata, PathParams, Post, Request } from 'ts-express-decorators';

// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

// Fluxgate
import { FindResult, IPrinter, IPrintTask, Printing } from '@fluxgate/common';
import { base64 } from '@fluxgate/core';

import { PrintService } from '../services/print.service';
import { IBodyRequest } from '../session/body-request.interface';
import { ISessionRequest } from '../session/session-request.interface';
import { ControllerCore } from './base/controller-core';
import { FindMethod } from './decorator/find-method.decorator';


@Controller(`/${Printing.TOPIC}`)
export class PrintController extends ControllerCore {
  protected static readonly logger = getLogger(PrintController);

  constructor(service: PrintService) {
    super(service);
  }

  @Authenticated()
  @Get(`/${Printing.GET_PRINTERS}`)
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
  @Post(`/${Printing.PRINT}`)
  public print(
    @Request() request: IBodyRequest<IPrintTask>
    ): Promise<any> {
    return Promise.resolve()
      .then(() => this.deserialize<IPrintTask>(request.body))
      .then((printTask) => this.getService().print(request, printTask))
      .then<any>((result) => this.serialize(result));
  }


  @Authenticated()
  @Post(`/${Printing.CREATE_PDF}`)
  public createPdf(
    @Request() request: IBodyRequest<IPrintTask>
    ): Promise<any> {
    return Promise.resolve()
      .then(() => this.deserialize<IPrintTask>(request.body))
      .then((printTask) => this.getService().createPdf(request, printTask))
      .then<any>((result) => this.serialize(result));
  }


  @Authenticated()
  @Post(`/${Printing.CREATE_PDF}`)
  public transferReport(
    @PathParams('reportName') reportName: string,
    @Request() request: IBodyRequest<base64>
    ): Promise<any> {
    return Promise.resolve()
      .then(() => this.deserialize<base64>(request.body))
      .then((report) => this.getService().transferReport(request, reportName, report))
      .then<any>((result) => this.serialize(result));
  }



  protected getService(): PrintService {
    return super.getService() as PrintService;
  }

}