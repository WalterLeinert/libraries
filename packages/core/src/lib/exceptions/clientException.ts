import { Exception } from './exception';
import { FlxException } from './flxException.decorator';


/**
 * Exceptions auf Clientseite
 *
 * @export
 * @class ClientException
 * @extends {Exception}
 */

@FlxException()
export class ClientException extends Exception {
  constructor(message: string, innerException?: Exception | Error) {
    super('ClientException', message, innerException);
    Object.setPrototypeOf(this, ClientException.prototype);
  }
}