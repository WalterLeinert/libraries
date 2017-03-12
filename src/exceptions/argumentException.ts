import { Exception } from './exception';


export class ArgumentException extends Exception {

  constructor(message: string, innerException?: Exception) {
    super(message, innerException);
  }

}