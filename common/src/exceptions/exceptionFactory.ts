import { ICtor } from '../base/ctor';
import { IException } from './exception.interface';


export class ExceptionFactory {
  private static exceptionDict: { [key: string]: ICtor<IException> } = {};

  public static register(type: string, exc: ICtor<IException>) {
    ExceptionFactory.exceptionDict[type] = exc;
  }


  public static create(type: string, message: string, innerException?: IException | Error): IException {
    const excClass = ExceptionFactory.exceptionDict[type];
    if (!excClass) {
      throw new Error(`No exception registered for type ${type}`);
    }

    return new excClass(message, innerException);
  }
}