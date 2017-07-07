import { Service } from 'ts-express-decorators';

// tslint:disable-next-line:no-var-requires
const email = require('emailjs/email');

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

import { IMessage, SmtpConfig } from '@fluxgate/common';
import { Assert, Core } from '@fluxgate/core';

import { ISMTPConfig } from './smtpconfig.interface';

import { ConfigService } from '../config.service';
import { ServiceCore } from '../service-core';


/**
 * Klasse für Versand von Emails über den Server
 *
 * @export
 * @class Email
 */
@Service()
export class EmailService extends ServiceCore {
  protected static readonly logger = getLogger(EmailService);

  public constructor(private configService: ConfigService) {
    super();
  }

  public send(message: IMessage, configId: string = SmtpConfig.DEFAULT_ID): Promise<any> {
    Assert.notNull(message);

    return using(new XLog(EmailService.logger, levels.INFO, 'Initialize Emailsystem'), (log) => {

      return new Promise<any>((resolve, reject) => {
        this.configService.findById<SmtpConfig>(null, SmtpConfig.name, configId).then((configResult) => {

          log.warn(`configResult = ${Core.stringify(configResult)}`);


          const smtpConfig: ISMTPConfig = {
            from: configResult.item.from,
            host: configResult.item.host,
            password: configResult.item.password,
            port: configResult.item.port,
            ssl: configResult.item.ssl,
            user: configResult.item.user
          };

          const mailtransport = email.server.connect(smtpConfig);
          if (!message.from) {
            message.from = configResult.item.from;
          }

          mailtransport.send(message, (err, themessage) => {
            if (err) {
              log.error(err);

              reject(err);
            } else {
              log.log(themessage);

              resolve(themessage);
            }
          });

        }).catch((err) => {
          log.error(err);
          reject(err);
        })
          ;
      });

    });
  }
}