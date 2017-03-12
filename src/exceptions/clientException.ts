import { Exception } from './exception';



export class ClientException extends Exception {
  constructor(message: string, innerException?: Exception) {
    super(message, innerException);
  }
}