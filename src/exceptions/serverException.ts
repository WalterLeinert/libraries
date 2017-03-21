import { Exception } from './exception';

/**
 * Exceptions auf Serverseite
 * 
 * @export
 * @class ServerException
 * @extends {Exception}
 */
export abstract class ServerException extends Exception {
  public httpStatus: number = 200;    // TODO: von Konstantendefinition übernehmen (ts-http...?)

  constructor(kind: string, message: string, innerException?: Exception | Error) {
    super(kind, message, innerException);
  }
}