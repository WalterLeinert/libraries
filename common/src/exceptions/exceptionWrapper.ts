import { Types } from '../types/types';
import { Exception } from './exception';
import { IException } from './exception.interface';
import { ExceptionFactory } from './exceptionFactory';
import { NotSupportedException } from './notSupportedException';

export class ExceptionWrapper {

  public static createBusinessException(error: string | IException | Error): IException {
    return ExceptionWrapper.createException('ServerBusinessException', error);
  }

  public static createSystemException(error: string | IException | Error): IException {
    return ExceptionWrapper.createException('ServerSystemException', error);
  }


  public static createException(kind: string, error: string | IException | Error): IException {
    let exc: IException;

    if (Types.isString(error)) {
      exc = ExceptionFactory.create(kind, (error as string));
    } else if (error instanceof Error) {
      const err = error as Error;
      exc = ExceptionFactory.create(kind, err.message, err);
    } else if ((error as any) instanceof Exception) {

      // TODO: prüfen, ob das immer so passt?
      exc = error as any as Exception;
    } else {
      throw new NotSupportedException(`error not supported: ${error}`);
    }

    return exc;
  }

}