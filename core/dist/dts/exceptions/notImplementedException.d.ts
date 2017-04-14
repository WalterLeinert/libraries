import { Exception } from './exception';
export declare class NotImplementedException extends Exception {
    constructor(message?: string, innerException?: Exception | Error);
}
