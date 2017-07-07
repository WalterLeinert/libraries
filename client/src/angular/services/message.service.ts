import { Injectable } from '@angular/core';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

import {
  Core, CustomSubject, IMessage, MessageSeverity, NotSupportedException,
  PublisherSubscriber
} from '@fluxgate/core';


/**
 * abstrakte Basisklasse für den MessageService
 * (der eigentliche Service @see{MessageService} muss wegen aot in fluxgate/components liegen)
 *
 * @export
 * @abstract
 * @class MessageServiceBase
 */
@Injectable()
export class MessageService {
  protected static readonly logger = getLogger(MessageService);

  private static readonly TOPIC = 'messages';

  protected pubSub = new PublisherSubscriber();


  public addMessage(message: IMessage) {
    using(new XLog(MessageService.logger, levels.INFO, 'addMessage'), (log) => {

      this.pubSub.publish(MessageService.TOPIC, message);

      // Exceptions werden bereits in Exception gelogged
      // hier nur bei Level Debug für Diagnose
      if (log.isDebugEnabled()) {
        switch (message.severity) {
          case MessageSeverity.Success:
          case MessageSeverity.Info:
            log.info(`message: ${Core.stringify(message)}`);
            break;

          case MessageSeverity.Warn:
            log.warn(`message: ${Core.stringify(message)}`);
            break;

          case MessageSeverity.Error:
            log.error(`message: ${Core.stringify(message)}`);
            break;

          case MessageSeverity.Fatal:
            log.fatal(`message: ${Core.stringify(message)}`);
            break;

          default:
            throw new NotSupportedException();
        }
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