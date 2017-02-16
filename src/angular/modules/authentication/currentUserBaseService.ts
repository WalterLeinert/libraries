import { EventEmitter, Output } from '@angular/core';

import { Observable } from 'rxjs/Observable';

// -------------------------- logging -------------------------------
import { configure, getLogger, ILogger, levels, Logger, using, XLog } from '@fluxgate/common';
// -------------------------- logging -------------------------------

// Fluxgate
import { IUser } from '@fluxgate/common';

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
      this.passportService.userChange.subscribe((user) => {
        this.user = user;
        log.debug(`currentUserChange: user = ${JSON.stringify(user)}`);
      });

      // initial aktuellen User ermitteln
      this.passportService.getCurrentUser().subscribe((user) => {
        this.user = user;
        log.debug(`getCurrentUser: user = ${JSON.stringify(user)}`);
      });
    });
  }
}