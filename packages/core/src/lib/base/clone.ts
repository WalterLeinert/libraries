
// tslint:disable:max-classes-per-file
// tslint:disable-next-line:no-var-requires
const entries = require('object.entries');

// tslint:disable-next-line:no-unused-variable
import { ILogger } from '../diagnostics/logger.interface';
import { getLogger } from '../diagnostics/logging-core';

import { Dictionary, KeyType } from '../types/dictionary';
import { InstanceCreator, InstanceSetter } from '../types/instanceAccessor';
import { Types } from '../types/types';
import { UniqueIdentifiable } from './uniqueIdentifiable';


export class ReferenceFixup<T> {
  constructor(public clonedObj: T, public valueSetter: InstanceSetter<T, any>, public clonedValue: T) {
    // ok
  }
}


export abstract class ClonerBase {
  private static predefinedCloners: Dictionary<string, InstanceCreator<any>> =
  new Dictionary<string, InstanceCreator<any>>();

  // tslint:disable-next-line:no-unused-variable
  private static initialized = (() => {
    ClonerBase.predefinedCloners.set(Date.name, (v) => new Date(v));
    ClonerBase.predefinedCloners.set(String.name, (v) => String(v));
    ClonerBase.predefinedCloners.set(Number.name, (v) => Number(v));
    ClonerBase.predefinedCloners.set(Boolean.name, (v) => Boolean(v));
    return true;
  })();

  private objectDict: Dictionary<any, any> = new Dictionary<any, any>(KeyType.Any);


  public constructor(private _checkCycles: boolean) {
  }

  protected get checkCycles(): boolean {
    return this._checkCycles;
  }


  protected static getPredefinedClonerFor(typeName: string): InstanceCreator<any> {
    return ClonerBase.predefinedCloners.get(typeName);
  }

  protected getRegisteredObject(value: any): any {
    let rval;

    if (Types.isObject(value) && !Types.isArray(value)) {
      rval = this.objectDict.get(value);
    }

    return rval;
  }


  protected registerObjectFor(value, clonedObj) {
    if (!Types.isArray(value)) {
      this.objectDict.set(value, clonedObj);
    }
  }

  protected iterateOnEntries(value: any, clonedValue: any,
    cb: (count: number, index: number, entryName: string, entryValue: any,
      clonedEntryName?: string, clonedEntryValue?: any) => void) {

    const valueIsUniqueIdentifiable = value instanceof UniqueIdentifiable;

    //
    // wir verwenden entries, da die 'for (const attr in value) { ...' Loop auch getter ohne Setter liefert,
    // was dann bei der Wertzuweisung nicht funktioniert!
    //
    const valueEntries = entries(value);

    let clonedValueEntries;
    if (clonedValue !== undefined) {
      clonedValueEntries = entries(clonedValue);
    }

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < valueEntries.length; i++) {
      const entry = valueEntries[i];
      const entryName: string = entry[0];
      const entryValue: any = entry[1];

      let clonedEntryName: string;
      let clonedEntryValue: any;

      if (clonedValueEntries !== undefined) {
        const clonedEntry = clonedValueEntries[i];
        clonedEntryName = clonedEntry[0];
        clonedEntryValue = clonedEntry[1];
      }

      // instanceId wird nicht geklont!
      if (!valueIsUniqueIdentifiable || (valueIsUniqueIdentifiable && entryName !== '_instanceId')) {
        cb(valueEntries.length, i, entryName, entryValue, clonedEntryName, clonedEntryValue);
      }

    }
  }
}


class Cloner extends ClonerBase {
  private fixups: Array<ReferenceFixup<any>> = [];


  /**
   * bei allen geklonten Objekten Referenzen auf geklonte Objekte korrigieren
   *
   * @memberOf Cloner
   */
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

    const predefCloner = ClonerBase.getPredefinedClonerFor(value.constructor.name);
    if (predefCloner !== undefined) {
      return predefCloner(value);
    }


    if (this.checkCycles) {
      // clone bereits erzeugt und registriert?
      const clone = super.getRegisteredObject(value);
      if (clone) {
        return clone;
      }
    }



    // neue Instanz erzeugen
    const clonedObj = Types.construct<any>(value as any);

    if (this.checkCycles) {
      // für Objekte clone registrieren
      super.registerObjectFor(value, clonedObj);
    }


    super.iterateOnEntries(value, undefined, (count, index, entryName, entryValue) => {
      if (typeof entryValue === 'object') {
        // rekursiv clonen

        if (Types.isObject(entryValue)) {
          const clonedValue = this.clone(entryValue);
          const fixup = new ReferenceFixup(clonedObj, (cl, cv) => { cl[entryName] = cv; }, clonedValue);
          this.fixups.push(fixup);

          clonedObj[entryName] = fixup;
        } else {
          clonedObj[entryName] = this.clone(entryValue);
        }

      } else {
        clonedObj[entryName] = entryValue;
      }
    });

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
  public static clone<T>(value: T, allowCycles: boolean = false): T {
    const cloner = new Cloner(allowCycles);
    const clonedValue = cloner.clone<T>(value);
    cloner.resolveFixups();

    return clonedValue;
  }
}