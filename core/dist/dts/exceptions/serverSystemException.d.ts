import { Exception } from './exception';
import { ServerException } from './serverException';
/**
 * technische Server-Exceptions
 *
 * @export
 * @class ServerSystemException
 * @extends {ServerException}
 */
export declare class ServerSystemException extends ServerException {
    constructor(message: string, innerException?: Exception | Error);
}
