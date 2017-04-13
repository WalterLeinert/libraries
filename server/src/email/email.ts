// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/common';
// -------------------------- logging -------------------------------

import { IServerConfiguration } from '../ts-express-decorators-flx/serverBase';


/**
 * Interface für eigentliche Email
 *
 * @export
 * @interface IMessage
 */
export interface IMessage {
  from?: string;
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  text: string;
}


/**
 * Klasse für Versand von Emails über den Server
 *
 * @export
 * @class Email
 */
export class Email {
  protected static readonly logger = getLogger(Email);
  public constructor(private configuration: IServerConfiguration) { }

  public sendmail(message: IMessage): void {
    return using(new XLog(Email.logger, levels.INFO, 'Initialize Emailsystem'), (log) => {
      const email = require('emailjs/email');
      const mailtransport = email.server.connect(this.configuration.mail);
      if (!message.from) {
        message.from = this.configuration.mail.from;
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