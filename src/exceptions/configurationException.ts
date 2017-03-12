import { Exception } from './exception';

export class ConfigurationException extends Exception {
  constructor(message: string, innerException?: Exception) {
    super(message, innerException);
  }
}