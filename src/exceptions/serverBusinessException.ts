import { Exception } from './exception';
import { ServerException } from './serverException';

export class ServerBusinessException extends ServerException {
  constructor(message: string, innerException?: Exception) {
    super(message, innerException);
  }
}