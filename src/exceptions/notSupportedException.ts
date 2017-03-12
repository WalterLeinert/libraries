import { Exception } from './exception';

export class NotSupportedException extends Exception {
  constructor(message: string = 'not supported', innerException?: Exception) {
    super(message, innerException);
  }
}