import { ApplicationRef, ErrorHandler, Inject, Injectable, Injector, NgModule } from '@angular/core';

// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

// Fluxgate
import { MessageService } from '@fluxgate/client';
import { Exception, MessageSeverity, ServerBusinessException } from '@fluxgate/core';


export interface ILoggingErrorHandlerOptions {
  rethrowError: boolean;
  unwrapError: boolean;
}

export const LOGGING_ERROR_HANDLER_OPTIONS: ILoggingErrorHandlerOptions = {
  rethrowError: false,
  unwrapError: false
};


@Injectable()
export class ApplicationErrorHandler extends ErrorHandler {
  protected static readonly logger = getLogger(ApplicationErrorHandler);

  constructor(private injector: Injector, private messageService: MessageService,
    @Inject(LOGGING_ERROR_HANDLER_OPTIONS) private options: ILoggingErrorHandlerOptions) {
    super(options.rethrowError);
  }

  public handleError(error: Error) {
    using(new XLog(ApplicationErrorHandler.logger, levels.INFO, 'handleError'), (log) => {
      if (log.isDebugEnabled()) {
        log.debug(error as any);
      }

      if (error instanceof Exception) {
        if (error.displayed) {
          return;
        }
      }

      this.messageService.addMessage({
        severity: error instanceof ServerBusinessException ? MessageSeverity.Info : MessageSeverity.Error,
        detail: error.message,
        summary: 'Internal Error. Ask for support.'
      });

      this.injector.get(ApplicationRef).tick();
    });
  }
}



const LOGGING_ERROR_HANDLER_PROVIDERS = [
  {
    provide: LOGGING_ERROR_HANDLER_OPTIONS,
    useValue: LOGGING_ERROR_HANDLER_OPTIONS
  },
  {
    provide: ErrorHandler,
    useClass: ApplicationErrorHandler
  }
];



// tslint:disable-next-line:max-classes-per-file
@NgModule({
  imports: [
  ],
  providers: [
    MessageService,
    LOGGING_ERROR_HANDLER_PROVIDERS
  ]
})
export class ApplicationErrorHandlerModule { }