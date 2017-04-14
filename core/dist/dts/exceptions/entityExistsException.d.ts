import { Exception } from './exception';
import { PersistenceException } from './persistenceException';
/**
 * Problem bei der Persistierung in der DB
 *
 * Entity existiert bereits mit dieser Id in der DB
 *
 * @export
 * @class EntityExistsException
 * @extends {PersistenceException}
 */
export declare class EntityExistsException extends PersistenceException {
    constructor(message: string, innerException?: Exception | Error);
}
