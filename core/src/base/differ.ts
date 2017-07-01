// tslint:disable:max-classes-per-file

import { Types } from '../types/types';
import { Assert } from '../util/assert';

import { ClonerBase } from './clone';



class DifferInternal<T> extends ClonerBase<T> {
  protected static readonly logger = getLogger(DifferInternal);

  /**
   * Verifiziert, dass @param{clonedValue} wirklich ein deep clone von @param{value} ist.
   */
  public diff<T>(value: T, clonedValue: T, attrName?: string) {
    if (value === clonedValue) {
      // undefined und null werden wie reguläre Primitive behandelt
      if (value === undefined || value == null) {
        return;
      }
      if (!Types.isPrimitive(value)) {
        DifferInternal.logger.error(`value identical to clonedValue: attrName = ${attrName}`);
      }
    }

    // primitive Typen sind ok
    if (Types.isPrimitive(value)) {
      if (value !== clonedValue) {
        DifferInternal.logger.error(
          `values different for attrName ${attrName}: value (${value}), clonedValue (${clonedValue}) `);
      }
      return;
    }

    // geklonte vordefinierte Typen sind ok
    const predefCloner = ClonerBase.getPredefinedClonerFor(value.constructor.name);
    if (predefCloner !== undefined) {
      return;
    }

    if (this.checkCycles) {
      // clone bereits erzeugt und registriert?
      const clone = super.getRegisteredObject(value);
      if (clone) {
        return;
      }


      // für Objekte clone registrieren
      super.registerObjectFor(value, clonedValue);
    }


    super.iterateOnEntries(value, clonedValue,
      (count, index, entryName, entryValue, clonedEntryName, clonedEntryValue) => {
        if (entryName !== clonedEntryName) {
          DifferInternal.logger.error(`entryName (${entryName}) !== clonedEntryName (${clonedEntryName})`);
        }

        Assert.that(typeof entryValue === typeof clonedEntryValue);

        if (Types.isObject(entryValue)) {
          if (entryValue === clonedEntryValue) {
            DifferInternal.logger.error(`value[${entryName}] identical to clonedValue[${clonedEntryName}]`);
            return;
          }

          this.diff(entryValue, clonedEntryValue, entryName);   // Rekursion
        }
      });

  }
}


/**
 * Hilfsklasse zum rekursiven Vergleich zweier Objektstrukturen.
 *
 * @export
 * @class Differ
 */
export class Differ {

  /**
   * Vergleicht die beiden Objektstrukturen @param{obj1} und @param{obj2}.
   *
   * @static
   * @template T
   * @param {T} obj1
   * @param {T} obj2
   * @param {boolean} [checkCycles=false]
   * @memberof Differ
   */
  public static diff<T>(obj1: T, obj2: T, checkCycles: boolean = false) {
    const differ = new DifferInternal<T>(checkCycles);
    differ.diff<T>(obj1, obj2);
  }
}