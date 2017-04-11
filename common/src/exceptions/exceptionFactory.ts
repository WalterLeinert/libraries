import { ICtor } from '../base/ctor';
import { IException } from './exception.interface';


export class ExceptionFactory {
  private static exceptionDict: { [key: string]: ICtor<IException> } = {};

  public static register(kind: string, exc: ICtor<IException>) {
    ExceptionFactory.exceptionDict[kind] = exc;
  }


  public static create(kind: string, message: string, innerException?: IException | Error): IException {
    const excClass = ExceptionFactory.exceptionDict[kind];
    if (!excClass) {
      throw new Error(`No exception registered for type ${kind}`);
    }

    return new excClass(message, innerException);
  }
}