import { Exception } from './exception';

export class NotSupportedException extends Exception {
  constructor(message: string, innerException?: Exception) {
    super(message, innerException);
  }
}