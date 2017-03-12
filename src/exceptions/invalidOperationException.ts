import { Exception } from './exception';


export class InvalidOperationException extends Exception {
  constructor(message: string, innerException?: Exception) {
    super(message, innerException);
  }
}