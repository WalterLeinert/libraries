import { Exception } from './exception';
import { ServerException } from './serverException';
/**
 * fachliche Server-Exceptions
 *
 * @export
 * @class ServerBusinessException
 * @extends {ServerException}
 */
export declare class ServerBusinessException extends ServerException {
    constructor(message: string, innerException?: Exception | Error);
}
