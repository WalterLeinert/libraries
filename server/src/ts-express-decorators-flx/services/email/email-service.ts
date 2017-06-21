import { Service } from 'ts-express-decorators';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

import { IMessage } from '@fluxgate/common';
import { Assert } from '@fluxgate/core';

import { ISMTPConfig } from './smtpconfig.interface';

import { SystemConfigService } from '../system-config.service';
import { SystemService } from '../system-service';



/**
 * Klasse für Versand von Emails über den Server
 *
 * @export
 * @class Email
 */
@Service()
export class EmailService extends SystemService<ISMTPConfig> {
  protected static readonly logger = getLogger(EmailService);

  public constructor(systemConfigService: SystemConfigService) {
    super(systemConfigService, 'smtp');
  }

  public send(message: IMessage): void {
    Assert.notNull(message);

    using(new XLog(EmailService.logger, levels.INFO, 'Initialize Emailsystem'), (log) => {
      const email = require('emailjs/email');
      const mailtransport = email.server.connect(this.config);
      if (!message.from) {
        message.from = this.config.from;
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