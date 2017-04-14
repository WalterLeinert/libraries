import { Exception } from './exception';
/**
 * Exception für ungültige/fehlende Argumente
 *
 * @export
 * @class ArgumentException
 * @extends {Exception}
 */
export declare class ArgumentException extends Exception {
    constructor(message: string, innerException?: Exception);
}
