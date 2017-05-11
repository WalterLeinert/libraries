import { Exception } from './exception';
import { FlxException } from './flxException.decorator';

@FlxException()
export class NotSupportedException extends Exception {
  constructor(message?: string, innerException?: Exception | Error) {
    super('NotSupportedException', message, innerException);
  }
}