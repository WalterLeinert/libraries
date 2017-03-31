import { Exception } from './exception';
import { FlxException } from './flxException';


@FlxException()
export class InvalidOperationException extends Exception {
  constructor(message: string, innerException?: Exception | Error) {
    super('InvalidOperationException', message, innerException);
  }
}