import { Exception } from './exception';
import { FlxException } from './flxException.decorator';

@FlxException()
export class ConfigurationException extends Exception {
  constructor(message: string, innerException?: Exception | Error) {
    super('ConfigurationException', message, innerException);
    Object.setPrototypeOf(this, ConfigurationException.prototype);
  }
}