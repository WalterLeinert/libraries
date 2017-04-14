import { Exception } from './exception';
/**
 * Exceptions auf Serverseite
 *
 * @export
 * @class ServerException
 * @extends {Exception}
 */
export declare abstract class ServerException extends Exception {
    httpStatus: number;
    protected constructor(kind: string, message: string, innerException?: Exception | Error);
}
