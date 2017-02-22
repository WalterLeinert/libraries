
// tslint:disable:max-classes-per-file
// tslint:disable-next-line:no-var-requires
const entries = require('object.entries');

import { Dictionary } from '../types/dictionary';
import { InstanceCreator, InstanceSetter } from '../types/instanceAccessor';
import { Types } from '../types/types';
import { Assert } from '../util/assert';
import { UniqueIdentifiable } from './uniqueIdentifiable';


class ReferenceFixup<T> {
  constructor(public clonedObj: T, public valueSetter: InstanceSetter<T, any>, public clonedValue: T) {
    // ok
  }
}


abstract class ClonerBase<T> {
  private static predefinedCloners: Dictionary<string, InstanceCreator<any>> =
  new Dictionary<string, InstanceCreator<any>>();

  // tslint:disable-next-line:no-unused-variable
  private static initialized = ClonerBase.initialize();

  private cloneDict: Dictionary<any, any> = new Dictionary<any, any>();

  private static initialize(): boolean {
    ClonerBase.predefinedCloners.set(Date.name, (v) => new Date(v));
    ClonerBase.predefinedCloners.set(String.name, (v) => String(v));
    ClonerBase.predefinedCloners.set(Number.name, (v) => Number(v));
    ClonerBase.predefinedCloners.set(Boolean.name, (v) => Boolean(v));
    return true;
  }

  public constructor(private _checkCycles: boolean) {

  }

  protected get checkCycles(): boolean {
    return this._checkCycles;
  }


  protected static getPredefinedClonerFor(typeName: string): InstanceCreator<any> {
    return ClonerBase.predefinedCloners.get(typeName);
  }

  protected getCloneFor(value: any): any {
    let rval;

    if (Types.isObject(value) && !Types.isArray(value)) {
      rval = this.cloneDict.get(value);
    }

    return rval;
  }


  protected registerClonFor(value, clonedObj) {
    if (!Types.isArray(value)) {
      this.cloneDict.set(value, clonedObj);
    }
  }

  protected iterateOnEntries(value: any, clonedValue: any, cb: (entryName: string, entryValue: any,
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
        cb(entryName, entryValue, clonedEntryName, clonedEntryValue);
      }

    }
  }
}


class Cloner<T> extends ClonerBase<T> {
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
      const clone = super.getCloneFor(value);
      if (clone) {
        return clone;
      }
    }



    // neue Instanz erzeugen    
    const clonedObj = Types.construct<any>(value as any);

    if (this.checkCycles) {
      // für Objekte clone registrieren
      super.registerClonFor(value, clonedObj);
    }


    super.iterateOnEntries(value, undefined, (entryName, entryValue) => {
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



class Verifier<T> extends ClonerBase<T> {

  /**
   * Verifiziert, dass @param{clonedValue} wirklich ein deep clone von @param{value} ist.
   */
  public verifyClone<T>(value: T, clonedValue: T, attrName?: string) {
    if (value === clonedValue) {
      // undefined und null werden wie reguläre Primitive behandelt 
      if (value === undefined || value == null) {
        return;
      }
      if (!Types.isPrimitive(value)) {
        throw new Error(`value identical to clonedValue: attrName = ${attrName}`);
      }
    }

    // primitive Typen sind ok 
    if (Types.isPrimitive(value)) {
      return;
    }

    // geklonte vordefinierte Typen sind ok
    const predefCloner = ClonerBase.getPredefinedClonerFor(value.constructor.name);
    if (predefCloner !== undefined) {
      return;
    }

    if (this.checkCycles) {
      // clone bereits erzeugt und registriert?
      const clone = super.getCloneFor(value);
      if (clone) {
        return;
      }


      // für Objekte clone registrieren
      super.registerClonFor(value, clonedValue);
    }


    super.iterateOnEntries(value, clonedValue, (entryName, entryValue, clonedEntryName, clonedEntryValue) => {
      Assert.that(entryName === clonedEntryName);

      Assert.that(typeof entryValue === typeof clonedEntryValue);

      if (Types.isObject(entryValue)) {
        if (entryValue === clonedEntryValue) {
          throw new Error(`value[${entryName}] identical to clonedValue[${clonedEntryName}]`);
        }

        this.verifyClone(entryValue, clonedEntryValue, entryName);   // Rekursion
      }
    });

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
    const cloner = new Cloner<T>(allowCycles);
    const clonedValue = cloner.clone<T>(value);
    cloner.resolveFixups();

    return clonedValue;
  }


  /**
   * Verifiziert, dass @param{clonedValue} wirklich ein deep clone von @param{value} ist.
   */
  public static verifyClone<T>(value: T, clonedValue: T, checkCycles: boolean = false) {
    const verifier = new Verifier<T>(checkCycles);
    verifier.verifyClone<T>(value, clonedValue);
  }
}