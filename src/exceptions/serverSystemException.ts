import { Exception } from './exception';
import { FlxException } from './flxException';
import { ServerException } from './serverException';


/**
 * technische Server-Exceptions
 * 
 * @export
 * @class ServerSystemException
 * @extends {ServerException}
 */
@FlxException()
export class ServerSystemException extends ServerException {
  constructor(message: string, innerException?: Exception | Error) {
    super('ServerSystemException', message, innerException);
  }
}