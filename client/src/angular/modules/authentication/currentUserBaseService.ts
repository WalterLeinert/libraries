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