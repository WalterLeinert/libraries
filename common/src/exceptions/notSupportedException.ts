import { Exception } from './exception';
import { FlxException } from './flxException';

@FlxException()
export class NotSupportedException extends Exception {
  constructor(message: string = 'not supported', innerException?: Exception | Error) {
    super('NotSupportedException', message, innerException);
  }
}