import { Identifiable } from '../base/uniqueIdentifiable';
import { Utility } from '../util/utility';


export class ConverterKey extends Identifiable {

  private constructor(private _toType: string, private _fromType) {
    super();
  }

  public toString(): string {
    return this._toType.toString() + '-' + this._fromType.toString();
  }

  /**
   * liefert den Hashcode für das Tuple
   *
   * HINWEIS: der Hashcode wird über toString() berechnet
   *
   * @readonly
   * @type {number}
   * @memberOf Tuple
   */
  public get instanceId(): number {
    return Utility.hashCodeForString(this.toString());
  }


  public static create(toType: string, fromType: string = String.name) {
    return new ConverterKey(toType, fromType);
  }
}
