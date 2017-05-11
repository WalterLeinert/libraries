import { Exception } from './exception';
import { FlxException } from './flxException.decorator';


@FlxException()
export class NotImplementedException extends Exception {
  constructor(message?: string, innerException?: Exception | Error) {
    super('NotImplementedException', message, innerException);
  }
}