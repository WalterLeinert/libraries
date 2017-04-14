import { Exception } from './exception';
export declare class ConfigurationException extends Exception {
    constructor(message: string, innerException?: Exception | Error);
}
