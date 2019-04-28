import { Exception } from './exception';
import { FlxException } from './flxException.decorator';
import { PersistenceException } from './persistenceException';


/**
 * Problem bei der Persistierung in der DB
 *
 * Entity wird nicht gefunden, ob wohl sie vorhanden sein müsste (z.T. generiert bei update)
 *
 * @export
 * @class EntityNotFoundException
 * @extends {PersistenceException}
 */
@FlxException()
export class EntityNotFoundException extends PersistenceException {
  constructor(message: string, innerException?: Exception | Error) {
    super(message, innerException);
    Object.setPrototypeOf(this, EntityNotFoundException.prototype);
    super.setKind('EntityNotFoundException');
  }
}