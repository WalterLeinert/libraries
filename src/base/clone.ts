// tslint:disable-next-line:no-var-requires
const entries = require('object.entries');

import { Types } from '../types/types';
import { Assert } from '../util/assert';
import { ICtor } from './ctor';
import { ObjectType } from './objectType';


export class Clone {

  /**
   * Liefert einen Clone von @param{value}
   * 
   * @static
   * @template T
   * @param {T} value
   * @returns {T}
   * 
   * @memberOf Clone
   */
  public static clone<T>(value: T): T {
    if (value === null) {
      return value;
    }

    // bei primitiven Typen liefern wir deren Wert
    if (Types.isPrimitive(value)) {
      return value;
    }


    // falls clone-Methode vorhanden ist nehmen wir diese
    if ((value as any).clone && Types.isFunction((value as any).clone)) {
      return (value as any).clone();
    }


    //
    // wir verwenden entries, da die 'for (const attr in value) { ...' Loop auch getter ohne Setter liefert,
    // was dann bei der Wertzweisung nicht funktioniert!
    //
    const valueEntries = entries(value);

    // neue Instanz erzeugen    
    const clonedObj = Types.construct<any>(value as any);

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < valueEntries.length; i++) {
      const entry = valueEntries[i];
      const entryName = entry[0];
      const entryValue = entry[1];

      if (typeof entryValue === 'object') {
        // rekursiv clonen
        clonedObj[entryName] = Clone.clone(entryValue);
      } else {
        clonedObj[entryName] = entryValue;
      }
    }
    return clonedObj;
  }


  /**
   * Verifiziert, dass @param{clonedValue} wirklich ein deep clone von @param{value} ist.
   */
  public static verifyClone<T>(value: T, clonedValue: T, attrName?: string) {
    if (value === clonedValue) {
      // undefined und null werden wie reguläre Primitive behandelt 
      if (value === undefined || value == null) {
        return;
      }
      if (!Types.isPrimitive(value)) {
        throw new Error(`value identical to clonedValue: attrName = ${attrName}`);
      }
    }

    const valueEntries = entries(value);
    const clonedValueEntries = entries(clonedValue);
    Assert.that(valueEntries.length === clonedValueEntries.length);


    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < valueEntries.length; i++) {
      const entry = valueEntries[i];
      const entryName = entry[0];
      const entryValue = entry[1];

      const clonedEntry = clonedValueEntries[i];
      const clonedEntryName = clonedEntry[0];
      const clonedEntryValue = clonedEntry[1];

      Assert.that(entryName === clonedEntryName);

      Assert.that(typeof entryValue === typeof clonedEntryValue);

      if (typeof entryValue === 'object') {
        if (entryValue === clonedEntryValue) {
          throw new Error(`value[${entryName}] identical to clonedValue[${clonedEntryName}]`);
        }

        Clone.verifyClone(entryValue, clonedEntryValue, entryName);
      }
    }

  }
}