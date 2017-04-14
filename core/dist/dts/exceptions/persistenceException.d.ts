import { Exception } from './exception';
import { ServerSystemException } from './serverSystemException';
/**
 * Problem bei der Persistierung in der DB
 *
 * @export
 * @class PersistenceException
 * @extends {ServerSystemException}
 */
export declare abstract class PersistenceException extends ServerSystemException {
    protected constructor(message: string, innerException?: Exception | Error);
}
