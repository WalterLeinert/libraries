import { IException } from './exception.interface';
export declare class WrappedException implements IException {
    private _nativeError;
    private _kind;
    constructor(_nativeError: Error);
    readonly message: string;
    readonly stack: string;
    readonly name: string;
    readonly kind: string;
    encodeException(): string;
    readonly innerException: IException;
}
