import { Exception } from './exception';
import { FlxException } from './flxException.decorator';
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
    Object.setPrototypeOf(this, EntityExistsException.prototype);

    super.setKind('EntityExistsException');
  }
}