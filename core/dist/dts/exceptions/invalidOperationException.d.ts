import { Exception } from './exception';
export declare class InvalidOperationException extends Exception {
    constructor(message?: string, innerException?: Exception | Error);
}
