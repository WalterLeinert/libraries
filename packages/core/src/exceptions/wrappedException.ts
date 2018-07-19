import { IException } from './exception.interface';

export class WrappedException implements IException {
  private _kind: string;

  constructor(private _nativeError: Error) {
    this._kind = 'WrappedException';
  }

  public get message(): string {
    return this._nativeError.message;
  }

  get stack(): string {
    return this._nativeError.stack;
  }

  get name(): string {
    return this._nativeError.name;
  }

  get kind(): string {
    return this._kind;
  }

  public get innerException(): IException {
    return null;
  }
}
