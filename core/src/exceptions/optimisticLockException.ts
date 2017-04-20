import { Exception } from './exception';
import { FlxException } from './flxException';
import { PersistenceException } from './persistenceException';


/**
 * Problem bei der Persistierung in der DB
 *
 * @export
 * @class OptimisticLockException
 * @extends {PersistenceException}
 */
@FlxException()
export class OptimisticLockException extends PersistenceException {
  constructor(message: string = 'not implemented', innerException?: Exception | Error) {
    super(message, innerException);
    super.setKind('OptimisticLockException');
  }
}