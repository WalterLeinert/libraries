import { Exception } from './exception';
export declare class NotSupportedException extends Exception {
    constructor(message?: string, innerException?: Exception | Error);
}
