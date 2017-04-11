import { Exception } from './exception';
import { FlxException } from './flxException';
import { PersistenceException } from './persistenceException';


/**
 * Problem bei der Persistierung in der DB
 *
 * Entity existiert bereits mit dieser Id in der DB
 *
 * @export
 * @class EntityExistsException
 * @extends {PersistenceException}
 */
@FlxException()
export class EntityExistsException extends PersistenceException {
  constructor(message: string, innerException?: Exception | Error) {
    super(message, innerException);
    super.setKind('EntityExistsException');
  }
}