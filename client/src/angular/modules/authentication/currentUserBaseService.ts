// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/common';

import { IUser } from '@fluxgate/common';

import { MessageService } from '../../services/message.service';
import { CurrentUser } from './currentUser';
import { PassportService } from './passport.service';


/**
 * TODO: obsolete wegen CoreComponent.getCurrentUser etc.
 * abstrakte Service-Basisklasse zum Überwachen des angemeldeten Users mittels @see{PassportService}. 
 * 
 * @export
 * @class CurrentUserBaseService
 */
export abstract class CurrentUserBaseService extends CurrentUser {

  protected constructor(private passportService: PassportService, messageService: MessageService) {
    super(messageService);

  }
}