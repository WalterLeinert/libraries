
// tslint:disable:max-classes-per-file
// tslint:disable-next-line:no-var-requires
const entries = require('object.entries');

import { Dictionary } from '../types/dictionary';
import { InstanceCreator, InstanceSetter } from '../types/instanceAccessor';
import { Types } from '../types/types';
import { Assert } from '../util/assert';
import { ICtor } from './ctor';
import { ObjectType } from './objectType';

class ReferenceFixup<T> {
  constructor(public clonedObj: T, public valueSetter: InstanceSetter<T, any>, public clonedValue: T) {
    // ok
  }
}

class Cloner<T> {
  private static predefinedCloners: Dictionary<string, InstanceCreator<any>> =
  new Dictionary<string, InstanceCreator<any>>();
  private static initialized = Cloner.initialize();

  private cloneDict: Dictionary<any, any> = new Dictionary<any, any>();
  private fixups: Array<ReferenceFixup<any>> = [];

  private static initialize(): boolean {
    Cloner.predefinedCloners.set(Date.name, (v) => new Date(v));
    Cloner.predefinedCloners.set(String.name, (v) => String(v));
    Cloner.predefinedCloners.set(Number.name, (v) => Number(v));
    Cloner.predefinedCloners.set(Boolean.name, (v) => Boolean(v));
    return true;
  }

  public resolveFixups() {
    this.fixups.forEach((fixup) => {
      fixup.valueSetter(fixup.clonedObj, fixup.clonedValue);
    });
  }

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
  public clone<T>(value: T): T {
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

    const predefCloner = Cloner.predefinedCloners.get(value.constructor.name);
    if (predefCloner !== undefined) {
      return predefCloner(value);
    }

    if (Types.isObject(value) && !Types.isArray(value)) {
      const clone = this.cloneDict.get(value);
      if (clone) {
        return clone;
      }
    }


    // neue Instanz erzeugen    
    const clonedObj = Types.construct<any>(value as any);

    if (!Types.isArray(value)) {
      this.cloneDict.set(value, clonedObj);
    }

    //
    // wir verwenden entries, da die 'for (const attr in value) { ...' Loop auch getter ohne Setter liefert,
    // was dann bei der Wertzweisung nicht funktioniert!
    //
    const valueEntries = entries(value);


    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < valueEntries.length; i++) {
      const entry = valueEntries[i];
      const entryName = entry[0];
      const entryValue = entry[1];

      if (typeof entryValue === 'object') {
        // rekursiv clonen

        if (Types.isObject(entryValue)) {
          const clonedValue = this.clone(entryValue);
          const fixup = new ReferenceFixup(clonedObj, (clone, cv) => { clone[entryName] = cv; }, clonedValue);
          this.fixups.push(fixup);

          clonedObj[entryName] = fixup;
        } else {
          clonedObj[entryName] = this.clone(entryValue);
        }

      } else {
        clonedObj[entryName] = entryValue;
      }
    }
    return clonedObj;
  }
}


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
    const cloner = new Cloner<T>();
    const clonedValue = cloner.clone<T>(value);
    cloner.resolveFixups();

    return clonedValue;
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