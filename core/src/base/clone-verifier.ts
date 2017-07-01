// tslint:disable:max-classes-per-file

import { InvalidOperationException } from '../exceptions/invalidOperationException';
import { Types } from '../types/types';
import { Assert } from '../util/assert';
import { ClonerBase } from './clone';


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
        throw new InvalidOperationException(`value identical to clonedValue: attrName = ${attrName}`);
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
      const clone = super.getRegisteredObject(value);
      if (clone) {
        return;
      }


      // für Objekte clone registrieren
      super.registerObjectFor(value, clonedValue);
    }


    super.iterateOnEntries(value, clonedValue,
      (count, index, entryName, entryValue, clonedEntryName, clonedEntryValue) => {
        Assert.that(entryName === clonedEntryName);

        Assert.that(typeof entryValue === typeof clonedEntryValue);

        if (Types.isObject(entryValue)) {
          if (entryValue === clonedEntryValue) {
            throw new InvalidOperationException(`value[${entryName}] identical to clonedValue[${clonedEntryName}]`);
          }

          this.verifyClone(entryValue, clonedEntryValue, entryName);   // Rekursion
        }
      });

  }
}


export class CloneVerifier {

  /**
   * Verifiziert, dass @param{clonedValue} wirklich ein deep clone von @param{value} ist.
   */
  public static verifyClone<T>(value: T, clonedValue: T, checkCycles: boolean = false) {
    const verifier = new Verifier<T>(checkCycles);
    verifier.verifyClone<T>(value, clonedValue);
  }
}