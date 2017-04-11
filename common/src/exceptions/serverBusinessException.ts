import { Exception } from './exception';
import { FlxException } from './flxException';
import { ServerException } from './serverException';


/**
 * fachliche Server-Exceptions
 *
 * @export
 * @class ServerBusinessException
 * @extends {ServerException}
 */

@FlxException()
export class ServerBusinessException extends ServerException {
  constructor(message: string, innerException?: Exception | Error) {
    super('ServerBusinessException', message, innerException);
  }
}