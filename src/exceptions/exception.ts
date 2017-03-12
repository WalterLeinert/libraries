export function unimplemented(): any {
  throw new Error('unimplemented');
}


/**
 * Exception-Basisklasse (analog zu angular.io BaseError)
 * 
 * @export
 * @class Exception
 * @extends {Error}
 */
export abstract class Exception extends Error {
  protected _nativeError: Error;

  protected constructor(message: string, private _innerException?: Exception) {
    super(message);

    const nativeError = new Error(message) as any as Error;
    this._nativeError = nativeError;
  }

  public get message(): string {
    return this._nativeError.message;
  }


  public get name(): string { return this._nativeError.name; }

  public get stack(): string {
    return (this._nativeError as any).stack;
  }

  public get innerException(): Exception { return this._innerException; }

  public toString(): string {
    return this._nativeError.toString();
  }
}
