import { Exception } from './exception';

export class WrappedException extends Exception {

  constructor(message: string, innerException: Exception) {
    super(`${message} caused by: ${innerException instanceof Error ? innerException.message : innerException}`,
      innerException);
  }

  get stack() {
    return ((this.innerException instanceof Error ? this.innerException : this._nativeError) as any)
      .stack;
  }
}
