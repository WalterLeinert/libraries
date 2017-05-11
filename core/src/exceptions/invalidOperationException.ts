import { Exception } from './exception';
import { FlxException } from './flxException.decorator';


@FlxException()
export class InvalidOperationException extends Exception {
  constructor(message: string = 'invalid operation', innerException?: Exception | Error) {
    super('InvalidOperationException', message, innerException);
  }
}