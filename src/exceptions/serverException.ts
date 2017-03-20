import { Exception } from './exception';

/**
 * Exceptions auf Serverseite
 * 
 * @export
 * @class ServerException
 * @extends {Exception}
 */
export abstract class ServerException extends Exception {
  constructor(kind: string, message: string, innerException?: Exception | Error) {
    super(kind, message, innerException);
  }
}