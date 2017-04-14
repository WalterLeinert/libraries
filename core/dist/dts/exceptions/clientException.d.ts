import { Exception } from './exception';
/**
 * Exceptions auf Clientseite
 *
 * @export
 * @class ClientException
 * @extends {Exception}
 */
export declare class ClientException extends Exception {
    constructor(message: string, innerException?: Exception | Error);
}
