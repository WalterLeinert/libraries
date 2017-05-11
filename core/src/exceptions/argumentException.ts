import { Exception } from './exception';
import { FlxException } from './flxException.decorator';

/**
 * Exception für ungültige/fehlende Argumente
 *
 * @export
 * @class ArgumentException
 * @extends {Exception}
 */
@FlxException()
export class ArgumentException extends Exception {

  constructor(message: string, innerException?: Exception) {
    super('ArgumentException', message, innerException);
  }

}