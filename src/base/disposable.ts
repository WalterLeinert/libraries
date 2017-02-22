// Logging
import { getLogger } from '../diagnostics/logger';
// tslint:disable-next-line:no-unused-variable
import { ILogger } from '../diagnostics/logger.interface';

import { IDisposable } from './disposable.interface';


/**
 * Abstract base class for disposable resources
 */
export abstract class Disposable implements IDisposable {
  protected static logger = getLogger(Disposable);

  /** if true, throw Error on double dispose */
  public static throwExceptionOnAlreadyDisposed = false;

  /** if true, log method entry/exit */
  public static doMethodTraces = false;

  private disposed = false;

  /**
   * frees required resources
   */
  public dispose() {
    // NOTE: EnterExitLogger not available due to recursion
    // using(new EnterExitLogger(Disposable.logger, levels.DEBUG, 'dispose'), (log) => {
    try {
      if (Disposable.doMethodTraces) {
        Disposable.logger.debug('>> dispose');
      }


      if (this.disposed) {
        if (Disposable.throwExceptionOnAlreadyDisposed) {
          throw new Error('Instance already disposed: ' + JSON.stringify(this));
        } else {
          Disposable.logger.debug('Instance already disposed: ', this);
        }
      } else {
        this.onDispose();
      }

    } finally {
      if (Disposable.doMethodTraces) {
        Disposable.logger.debug('<< dispose');
      }
      this.disposed = true;
    }
    // });
  }

  /**
   * Will be called by @see {Disposable.dispose}.
   * Must be overridden in derived classes.
   */
  protected onDispose() {
    // ok
  }
}


/**
 * Just like in C# this 'using' function will ensure the passed disposable is disposed when the closure has finished.
 *
 * Usage:
 * ```typescript
 * using(new DisposableObject(), (myObj)=>{
 *   // do work with myObj
 * });
 * // myObj automatically has it's dispose method called.
 * ```
 * from https://github.com/electricessence/TypeScript.NET
 *
 * @param {TDisposable} disposable - disposable resource
 * @param {(disposable: TDisposable)} - closure Function call to execute.
 * @returns {TReturn} Returns whatever the closure's return value is.
 */
export function using<TDisposable extends IDisposable, TReturn>(
  disposable: TDisposable,
  closure: (disposable: TDisposable) => TReturn): TReturn {
  try {
    return closure(disposable);
  } finally {
    disposable.dispose();
  }
}
