import { ApplicationRef, ErrorHandler, Injector, NgModule } from '@angular/core';

// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/common';
// -------------------------- logging -------------------------------

import { MessageService, MessageServiceModule, MessageSeverity } from '../../services/message.service';

export class ApplicationErrorHandler extends ErrorHandler {
  protected static readonly logger = getLogger(ApplicationErrorHandler);

  constructor(/*private injector: Injector, private messageService: MessageService*/) {
    super(true);
  }

  public handleError(error: any) {
    using(new XLog(ApplicationErrorHandler.logger, levels.INFO, 'handleError'), (log) => {
      log.error(error);
      // if (log.isDebugEnabled()) {
      //   log.debug(error);
      // }

      // this.messageService.addMessage({
      //   severity: MessageSeverity.Error,
      //   summary: error
      // });

      // this.injector.get(ApplicationRef).tick();
    });
  }
}


// tslint:disable-next-line:max-classes-per-file
@NgModule({
  imports: [
    MessageServiceModule
  ],
  providers: [
    { provide: ErrorHandler, useClass: ApplicationErrorHandler }]
})
export class ApplicationErrorHandlerModule { }
