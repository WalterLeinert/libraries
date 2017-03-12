import { Exception } from './exception';

export class ServerException extends Exception {
  constructor(message: string, innerException?: Exception) {
    super(message, innerException);
  }
}