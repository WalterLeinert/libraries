import { IException } from './exception.interface';

export class WrappedException implements IException {
  private _type: string;

  constructor(private _nativeError: Error) {
    this._type = 'WrappedException';
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

  get type(): string {
    return this._type;
  }

  public encodeException(): string {
    return 'TODO';
  }
}
