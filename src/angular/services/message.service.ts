// Angular
import { Injectable, NgModule } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';


// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/common';
// -------------------------------------- logging --------------------------------------------


@Injectable()
export class MessageService {
  protected static readonly logger = getLogger(MessageService);

  private messages: Subject<IMessage> = new BehaviorSubject<IMessage>(null);

  public addMessage(message: IMessage) {
    using(new XLog(MessageService.logger, levels.INFO, 'addMessage'), (log) => {
      this.messages.next(message);

      switch (message.severity) {
        case MessageSeverity.Info:
          log.info(`message: ${JSON.stringify(message)}`);
          break;

        case MessageSeverity.Warn:
          log.warn(`message: ${JSON.stringify(message)}`);
          break;

        case MessageSeverity.Error:
          log.error(`message: ${JSON.stringify(message)}`);
          break;

        case MessageSeverity.Fatal:
          log.fatal(`message: ${JSON.stringify(message)}`);
          break;

        default:
          throw new Error('not supported');
      }
    });
  }

  public clearMessage() {
    this.messages.next();
  }

  public subscribe(): Observable<IMessage> {
    return this.messages.asObservable();
  }
}

export enum MessageSeverity {
  Info,
  Warn,
  Error,
  Fatal
}

export interface IMessage {
  severity: MessageSeverity;
  summary: string;
  detail?: string;
}


// tslint:disable-next-line:max-classes-per-file
@NgModule({
  providers: [MessageService]
})
export class MessageServiceModule { }