import { StringBuilder } from '../base/stringBuilder';
import { CoreInjector } from '../di/core-injector';
import { ConsoleLogger } from '../diagnostics/consoleLogger';
import { ILogger } from '../diagnostics/logger.interface';
import { LOG_EXCEPTIONS, LOGGER } from '../diagnostics/logger.token';
import { Utility } from '../util/utility';
import { IException } from './exception.interface';
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
  protected static readonly logger = new ConsoleLogger(Exception);

  private _nativeError: Error;
  private _message: string;
  private _innerException: IException;
  private _displayed: boolean;


  protected constructor(private _kind: string, message: string, innerException?: IException | Error) {
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
        this._innerException = new WrappedException(new Error(innerException.message));
      }

      // sb.append(', innerException: ');
      // sb.append(this._innerException.message);
    }

    this._message = sb.toString();

    const logException: boolean = CoreInjector.instance.getInstance<boolean>(LOG_EXCEPTIONS, true);

    if (logException) {
      const logger = CoreInjector.instance.getInstance<ILogger>(LOGGER, Exception.logger);
      if (logger) {
        logger.error(`kind: ${this.kind}, message: ${this.message}, stack: ${this.stack}`);
      }
    }
  }


  public toString(): string {
    return `${this.name}: ${this.message}`;
  }

  protected setKind(kind: string) {
    this._kind = kind;
  }

  public get kind(): string {
    return this._kind;
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

  public get displayed(): boolean {
    return this._displayed;
  }

  public set displayed(value: boolean) {
    this._displayed = value;
  }

  private isPresent(value: any) {
    return !(value === undefined || value === null);
  }

}