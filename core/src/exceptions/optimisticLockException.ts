import { Exception } from './exception';
import { FlxException } from './flxException.decorator';
import { ServerBusinessException } from './serverBusinessException';


/**
 * Versuch Daten zu speichern, die mit gleicher Version bereits vorher gespeichert wurden.
 *
 * @export
 * @class OptimisticLockException
 * @extends {PersistenceException}
 */
@FlxException()
export class OptimisticLockException extends ServerBusinessException {
  constructor(message: string = 'not implemented', innerException?: Exception | Error) {
    super(message, innerException);
    super.setKind('OptimisticLockException');
  }
}