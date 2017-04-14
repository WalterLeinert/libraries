import { Exception } from './exception';
import { PersistenceException } from './persistenceException';
/**
 * Problem bei der Persistierung in der DB
 *
 * @export
 * @class OptimisticLockException
 * @extends {PersistenceException}
 */
export declare class OptimisticLockException extends PersistenceException {
    constructor(message?: string, innerException?: Exception | Error);
}
