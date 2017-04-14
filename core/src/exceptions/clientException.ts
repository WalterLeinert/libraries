import { Exception } from './exception';
import { FlxException } from './flxException';


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
  }
}