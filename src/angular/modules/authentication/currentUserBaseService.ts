// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/common';

import { CurrentUser } from './currentUser';
import { PassportService } from './passport.service';


/**
 * abstrakte Service-Basisklasse zum Überwachen des angemeldeten Users mittels @see{PassportService}. 
 * 
 * @export
 * @class CurrentUserBaseService
 */
export abstract class CurrentUserBaseService extends CurrentUser {
  protected static logger = getLogger(CurrentUserBaseService);

  protected constructor(private passportService: PassportService) {
    super();

    using(new XLog(CurrentUserBaseService.logger, levels.INFO, 'ctor'), (log) => {
      this.registerSubscription(this.passportService.userChange.subscribe((user) => {
        this.userInternal = user;
        log.debug(`currentUserChange: user = ${JSON.stringify(user)}`);
      }));

      // initial aktuellen User ermitteln
      this.registerSubscription(this.passportService.getCurrentUser().subscribe((user) => {
        this.userInternal = user;
        log.debug(`getCurrentUser: user = ${JSON.stringify(user)}`);
      }));
    });
  }
}