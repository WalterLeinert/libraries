import { Exception } from './exception';


export class NotImplementedException extends Exception {
  constructor(message: string, innerException?: Exception) {
    super(message, innerException);
  }
}