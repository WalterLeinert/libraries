import { ICtor } from '../base/ctor';
import { IException } from './exception.interface';
import { ExceptionFactory } from './exceptionFactory';

export function FlxException() {
  // tslint:disable-next-line:only-arrow-functions
  return function(target: ICtor<IException>) {
    ExceptionFactory.register(target.name, target);
  };
}