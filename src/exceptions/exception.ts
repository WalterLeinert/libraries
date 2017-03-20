import { StringBuilder } from '../base/stringBuilder';
// TODO: import { Assert } from '../util/assert';
import { IException } from './exception.interface';
import { ExceptionFactory } from './exceptionFactory';
import { WrappedException } from './wrappedException';

export function unimplemented(): any {
  throw new Error('unimplemented');
}


/**
 * Exception-Basisklasse 
 * (analog zu https://github.com/Romakita/ts-httpexceptions/blob/master/src/exception.ts)
 * 
 * @export
 * @class Exception
 * @extends {Error}
 */
export abstract class Exception implements IException {
  public static readonly EXC_PREFIX = '{exc:';
  public static readonly EXC_POSTFIX = '}';
  public static readonly EXC_SEPARATOR = '::';

  private _nativeError: Error;
  private _message: string;
  private _innerException: IException;

  public constructor(private _type: string, message: string, innerException?: IException | Error) {
    if (message === undefined) {
      this._nativeError = new Error('undefined');
    } else {
      this._nativeError = new Error(message);
    }

    const sb = new StringBuilder(message || '');

    if (innerException !== undefined) {
      if (innerException instanceof Exception) {
        this._innerException = innerException;
      } else if (innerException instanceof Error) {
        this._innerException = new WrappedException(innerException);
      } else if (typeof innerException === 'string') {
        this._innerException = new WrappedException(new Error(innerException));
      } else {
        this._innerException = new WrappedException(new Error(innerException));
      }

      // sb.append(', innerException: ');
      // sb.append(this._innerException.message);
    }

    this._message = sb.toString();
  }

  public get type(): string {
    return this._type;
  }

  public get name(): string {
    return this._nativeError && this._nativeError.name ? this._nativeError.name : 'name-undefined';
  }

  public get stack(): string {
    return (this._nativeError as any).stack;
  }

  public get message(): string {
    return this._message;
  }

  public get innerException(): IException {
    return this._innerException;
  }


  public toString(): string {
    return `${this.name}: ${this.message}`;
  }

  public encodeException(): string {
    const sb = new StringBuilder();
    sb.append(Exception.EXC_PREFIX);
    sb.append(this.type);
    sb.append(Exception.EXC_SEPARATOR);
    sb.append(this.message || '');
    sb.append(Exception.EXC_SEPARATOR);

    if (this.innerException) {
      sb.append(this.innerException.encodeException());   // Rekursion
    }

    sb.append(Exception.EXC_POSTFIX);

    return sb.toString();
  }


  public static decodeException(message: string): IException {
    if (message.startsWith(Exception.EXC_PREFIX)) {
      // TODO: Assert.that(message.endsWith(Exception.EXC_POSTFIX));

      // "{exc:ServerBusinessException::This is a ServerBusinessException.::}"
      // --> "{exc:ServerBusinessException::This is a ServerBusinessException.::"
      let text = message.slice(0, message.length - 2);

      // --> "ServerBusinessException::This is a ServerBusinessException.::"    
      text = message.slice(Exception.EXC_PREFIX.length);

      const messageSeparatorIndex = text.indexOf(Exception.EXC_SEPARATOR);
      // TODO: Assert.that(messageSeparatorIndex >= 0,
      //   `"${text}": no exception message separator "${Exception.EXC_SEPARATOR}"`);

      // -> "ServerBusinessException"
      const exceptionType: string = text.slice(0, messageSeparatorIndex);

      // -> "This is a ServerBusinessException.::"
      text = text.slice(messageSeparatorIndex + Exception.EXC_SEPARATOR.length);

      const exceptionSeparatorIndex = text.indexOf(Exception.EXC_SEPARATOR);
      // TODO: Assert.that(exceptionSeparatorIndex >= 0,
      //  `"${text}": no inner exception separator "${Exception.EXC_SEPARATOR}"`);

      // -> "This is a ServerBusinessException."
      const excMessage = text.slice(0, exceptionSeparatorIndex);

      // --> ""
      text = text.slice(messageSeparatorIndex + Exception.EXC_SEPARATOR.length - 1);

      let innerException;

      if (text.length > 0) {
        innerException = Exception.decodeException(text);
      }

      return ExceptionFactory.create(exceptionType, excMessage, innerException);
    }

    return undefined;
  }
}
