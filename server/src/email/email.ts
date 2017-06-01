// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

import { IMessage } from './email.interface';


/**
 * Klasse für Versand von Emails über den Server
 *
 * @export
 * @class Email
 */
export class Email {
  protected static readonly logger = getLogger(Email);
  public constructor(private configuration: IMessage) { }

  public sendmail(message: IMessage): void {
    return using(new XLog(Email.logger, levels.INFO, 'Initialize Emailsystem'), (log) => {
      const email = require('emailjs/email');
      const mailtransport = email.server.connect(this.configuration);
      if (!message.from) {
        message.from = this.configuration.from;
      }

      mailtransport.send(message, (err, themessage) => {
        if (err) {
          log.error(err);
        } else {
          log.log(themessage);
        }
      });
    });
  }

}