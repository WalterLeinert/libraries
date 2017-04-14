import { ICtor } from '../base/ctor';
import { IException } from './exception.interface';
export declare class ExceptionFactory {
    private static exceptionDict;
    static register(kind: string, exc: ICtor<IException>): void;
    static create(kind: string, message: string, innerException?: IException | Error): IException;
}
