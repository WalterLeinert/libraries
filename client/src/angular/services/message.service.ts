// tslint:disable:max-classes-per-file

// Angular
import { Injectable, NgModule } from '@angular/core';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------


import { CustomSubject, IMessage, MessageSeverity, NotSupportedException, PublisherSubscriber } from '@fluxgate/core';


@Injectable()
export class MessageService {
  protected static readonly logger = getLogger(MessageService);

  private static readonly TOPIC = 'messages';

  private pubSub = new PublisherSubscriber();


  public addMessage(message: IMessage) {
    using(new XLog(MessageService.logger, levels.INFO, 'addMessage'), (log) => {

      this.pubSub.publish(MessageService.TOPIC, message);

      switch (message.severity) {
        case MessageSeverity.Success:
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
          throw new NotSupportedException();
      }
    });
  }

  public clearMessage() {
    throw new NotSupportedException();
  }

  /**
   * Liefert die Message als shared @see{Observable}.
   *
   * @returns {Observable<IMessage>}
   *
   * @memberOf MessageService
   */
  public getMessage(): CustomSubject<IMessage> {
    return this.pubSub.subscribe<IMessage>(MessageService.TOPIC);
  }
}


// tslint:disable-next-line:max-classes-per-file
@NgModule({
  providers: [MessageService]
})
export class MessageServiceModule { }