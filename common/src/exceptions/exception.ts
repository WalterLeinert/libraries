import { StringBuilder } from '../base/stringBuilder';
import { Utility } from '../util/utility';
import { IException } from './exception.interface';
import { ExceptionFactory } from './exceptionFactory';
import { WrappedException } from './wrappedException';


export function unimplemented(): void {
  throw new Error('unimplemented');
}

/**
 * Assertion, die nicht auf der Exception-Basisklasse basiert (sonst: Rekursion!)
 * 
 * @export
 * @param {boolean} condition 
 * @param {string} [message] 
 */
export function assert(condition: boolean, message?: string): void {
  if (!condition) {
    const sb = new StringBuilder('assertion failed');
    if (!Utility.isNullOrEmpty(message)) {
      sb.append(': ');
      sb.append(message);
    }
    throw new Error();
  }
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


  /**
   * Liefert true, falls die Meldung mit dem Präfix für kodierte Exceptions beginnt. 
   * 
   * @static
   * @param {string} message 
   * @returns 
   * 
   * @memberOf Exception
   */
  public static isEncodedException(message: string) {
    return message.startsWith(Exception.EXC_PREFIX);
  }


  /**
   * Liefert für die Fehlermeldung @param{message} eine @see{IException}
   * 
   * Ist in der Meldung eine spezielle Exception (mit ggf. inner exceptions) kodiert,
   * wird diese konkrete Exception erzeugt.
   * 
   * Beispiel: {exc:ServerBusinessException::unknown user::{exc:AssertionException::property username is missing::}}
   * 
   * -> ServerBusinessException (inner: AssertionException)
   * 
   * @static
   * @param {string} message 
   * @returns {IException} 
   * 
   * @memberOf Exception
   */
  public static decodeException(message: string): IException {
    if (Exception.isEncodedException(message)) {
      assert(message.endsWith(Exception.EXC_POSTFIX));

      // "{exc:ServerBusinessException::This is a ServerBusinessException.::}"
      // --> "{exc:ServerBusinessException::This is a ServerBusinessException.::"
      let text = message.slice(0, message.length - Exception.EXC_POSTFIX.length);

      // --> "ServerBusinessException::This is a ServerBusinessException.::"    
      text = text.slice(Exception.EXC_PREFIX.length);

      const messageSeparatorIndex = text.indexOf(Exception.EXC_SEPARATOR);
      assert(messageSeparatorIndex >= 0,
        `"${text}": no exception message separator "${Exception.EXC_SEPARATOR}"`);

      // -> "ServerBusinessException"
      const exceptionType: string = text.slice(0, messageSeparatorIndex);

      // -> "This is a ServerBusinessException.::"
      text = text.slice(messageSeparatorIndex + Exception.EXC_SEPARATOR.length);

      const exceptionSeparatorIndex = text.indexOf(Exception.EXC_SEPARATOR);
      assert(exceptionSeparatorIndex >= 0,
        `"${text}": no inner exception separator "${Exception.EXC_SEPARATOR}"`);

      // -> "This is a ServerBusinessException."
      const excMessage = text.slice(0, exceptionSeparatorIndex);

      // --> ""
      text = text.slice(exceptionSeparatorIndex + Exception.EXC_SEPARATOR.length);

      let innerException;

      if (text.length > 0) {
        innerException = Exception.decodeException(text);
      }

      return ExceptionFactory.create(exceptionType, excMessage, innerException);
    }

    return undefined;
  }
}
